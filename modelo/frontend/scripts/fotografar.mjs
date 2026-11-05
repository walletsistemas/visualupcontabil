// Tira as FOTOS e as ANIMAÇÕES (GIF) do guia a partir da vitrine, usando o Edge já instalado no Windows.
// Uso: npm run build && npx vite preview --port 4173   (em outro terminal; abre as telas sem Python)
//      npm run fotos                                     -> grava em ../../imagens
// Serve também para a pessoa fotografar o SEU sistema depois da cirurgia (troque as telas abaixo).
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const BASE = process.env.VITRINE ?? "http://localhost:4173";
const SAIDA = path.resolve(import.meta.dirname, "../../../imagens");
const TAM = { width: 1440, height: 900 };

const TELAS = [
  ["painel", "painel"],
  ["cadastro", "cadastro-cartoes"],
  ["tabela", "tabela"],
  ["formulario", "formulario"],
  ["pecas", "pecas"],
];

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function abrir(navegador, tema, extra = {}) {
  const ctx = await navegador.newContext({ viewport: TAM, deviceScaleFactor: 1, colorScheme: tema === "escuro" ? "dark" : "light", ...extra });
  await ctx.addInitScript((t) => localStorage.setItem("tema", t), tema);
  return ctx;
}

async function fotos(navegador, tema) {
  const pasta = path.join(SAIDA, tema);
  fs.mkdirSync(pasta, { recursive: true });
  const ctx = await abrir(navegador, tema);
  const p = await ctx.newPage();
  const foto = async (nome, opcoes = {}) => {
    await espera(700);
    await p.screenshot({ path: path.join(pasta, `${nome}.png`), ...opcoes });
    console.log(`  ${tema}/${nome}.png`);
  };

  await p.goto(BASE);
  await foto("entrada");
  await p.fill('input[placeholder="Usuário"]', "ana souza");
  await foto("entrada-com-usuario");

  for (const [tela, nome] of TELAS) {
    await p.goto(`${BASE}/?tela=${tela}`);
    await foto(nome);
  }

  // cadastro em lista e a ficha lateral
  await p.goto(`${BASE}/?tela=cadastro`);
  await espera(600);
  await p.locator("main button:has(svg.lucide-list)").click();
  await foto("cadastro-lista");
  await p.locator("tbody tr").first().click();
  await foto("ficha-lateral");
  await p.keyboard.press("Escape");

  // busca Ctrl+K
  await p.keyboard.press("Control+k");
  await p.keyboard.type("al");
  await foto("busca-rapida");
  await p.keyboard.press("Escape");

  // menu recolhido
  await p.keyboard.press("Control+b");
  await foto("menu-recolhido");
  await p.keyboard.press("Control+b");

  // menu da conta
  await p.locator('button[aria-label^="Conta de"]').click();
  await foto("menu-conta");
  await p.keyboard.press("Escape");

  // peças, uma por uma (recorte só da seção)
  await p.goto(`${BASE}/?tela=pecas`);
  await espera(600);
  for (const id of ["botoes", "campos", "controles", "selos", "janelas", "estados", "cores"]) {
    await p.locator(`#${id}`).screenshot({ path: path.join(pasta, `peca-${id}.png`) });
    console.log(`  ${tema}/peca-${id}.png`);
  }
  await p.getByRole("button", { name: "Abrir janela" }).click();
  await foto("janela");
  await p.keyboard.press("Escape");
  await espera(300);
  await p.getByRole("button", { name: "Pergunta sim/não" }).click();
  await foto("pergunta");
  await p.keyboard.press("Escape");
  await espera(300);
  await p.getByRole("button", { name: "Balão de erro" }).click();
  await p.getByRole("button", { name: "Balão de sucesso" }).click();
  await foto("baloes", { clip: { x: 420, y: 0, width: 600, height: 200 } });

  // formulário com erros
  await p.goto(`${BASE}/?tela=formulario`);
  await espera(500);
  await p.getByRole("button", { name: "Salvar" }).click();
  await foto("formulario-erros");

  await ctx.close();
}

/**
 * ANIMAÇÕES em GIF: fotografa a tela sem parar enquanto o roteiro roda e junta os quadros
 * com o Pillow do Python (scripts/gif.py). Sem ffmpeg, sem baixar nada.
 */
async function videos(navegador) {
  const pasta = path.join(SAIDA, "animacoes");
  fs.mkdirSync(pasta, { recursive: true });
  const gravar = async (nome, endereco, roteiro) => {
    const quadros = fs.mkdtempSync(path.join(os.tmpdir(), "quadros-"));
    const ctx = await abrir(navegador, "claro", { viewport: { width: 1152, height: 720 } });
    const p = await ctx.newPage();
    await p.goto(endereco);
    await espera(300);
    let rodando = true;
    const tempos = [];
    const fotografar = (async () => {
      while (rodando) {
        const n = String(tempos.length).padStart(4, "0");
        try {
          await p.screenshot({ path: path.join(quadros, `${n}.jpg`), type: "jpeg", quality: 85, timeout: 5000 });
          tempos.push(Date.now());
        } catch (e) {
          if (!String(e).includes("navigat")) console.log("   quadro perdido:", String(e).split(/\r?\n/)[0]);
          await espera(30); // trocando de página
        }
      }
    })();
    await roteiro(p);
    rodando = false;
    await fotografar;
    await ctx.close();
    fs.writeFileSync(path.join(quadros, "tempos.json"), JSON.stringify(tempos));
    const destino = path.join(pasta, `${nome}.gif`);
    execFileSync("python", ["-I", path.join(import.meta.dirname, "gif.py"), quadros, destino], { stdio: "inherit" });
    fs.rmSync(quadros, { recursive: true, force: true });
    console.log(`  animacoes/${nome}.gif`);
  };

  await gravar("entrada", BASE, async (p) => {
    await espera(1500);
    await p.click("button[type=submit]"); // vazio: o cartão treme
    await espera(900);
    await p.locator('input[placeholder="Usuário"]').pressSequentially("ana souza", { delay: 90 });
    await espera(700);
    await p.locator('input[placeholder="Senha"]').pressSequentially("123456", { delay: 60 });
    await p.click("button[type=submit]");
    await espera(2000);
  });

  await gravar("menu-lateral", `${BASE}/?tela=painel`, async (p) => {
    await espera(1200);
    for (const nome of ["Cadastro", "Tabela", "Formulário", "Painel"]) {
      await p.locator(`nav button[aria-label="${nome}"]`).click();
      await espera(800);
    }
    await p.locator("nav button", { hasText: "Gestão" }).click(); // dobra a seção
    await espera(800);
    await p.locator("nav button", { hasText: "Gestão" }).click();
    await espera(800);
    await p.keyboard.press("Control+b");
    await espera(1000);
    await p.keyboard.press("Control+b");
    await espera(1200);
  });

  await gravar("ficha-e-janela", `${BASE}/?tela=cadastro`, async (p) => {
    await espera(1500);
    await p.locator("main [role=button]").nth(1).hover();
    await espera(600);
    await p.locator("main [role=button]").nth(1).click();
    await espera(1400);
    await p.getByRole("button", { name: "Apagar" }).click();
    await espera(1400);
    await p.keyboard.press("Escape");
    await espera(800);
    await p.keyboard.press("Escape");
    await espera(1000);
  });

  await gravar("busca-e-segmentado", `${BASE}/?tela=cadastro`, async (p) => {
    await espera(1200);
    await p.getByRole("button", { name: "Em aberto" }).click();
    await espera(700);
    await p.getByRole("button", { name: "Todos" }).click();
    await espera(700);
    await p.keyboard.press("Control+k");
    await espera(600);
    await p.keyboard.type("tab", { delay: 120 });
    await espera(900);
    await p.keyboard.press("Enter");
    await espera(1500);
  });
}

const navegador = await chromium.launch({ channel: "msedge" });
try {
  // SO=fotos | SO=animacoes  -> só uma parte (sem SO: tudo)
  const so = process.env.SO;
  if (!so || so === "fotos")
    for (const tema of ["claro", "escuro"]) {
      console.log(`Fotos (${tema})`);
      await fotos(navegador, tema);
    }
  if (!so || so === "animacoes") {
    console.log("Animações");
    await videos(navegador);
  }
} finally {
  await navegador.close();
}
