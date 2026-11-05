import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CabecalhoTela } from "@/componentes/layout/JanelaPrincipal";
import { Botao } from "@/componentes/ui/botao";
import { CampoRotulado } from "@/componentes/ui/campo";
import { AreaTexto } from "@/componentes/ui/campos-extra";
import { Lista, Escolha } from "@/componentes/ui/lista";
import { CaixaSelecao } from "@/componentes/ui/caixa-selecao";
import { Interruptor } from "@/componentes/ui/interruptor";
import { SeletorData, SeletorHora } from "@/componentes/ui/seletor-data";
import { AvisoErro } from "@/componentes/ui/aviso-erro";
import { ErroDoCampo, TituloGrupo } from "@/componentes/ui/pecas";
import { cn } from "@/lib/utils";
import { PESSOAS_EXEMPLO } from "@/dados/exemplo";

const esquema = z.object({
  nome: z.string().trim().min(3, "Escreva pelo menos 3 letras."),
  codigo: z.string().trim().regex(/^\d{4}-\d$/, "Use o formato 0000-0."),
  contato: z.email("E-mail inválido.").or(z.literal("")),
  categoria: z.string(),
  equipe: z.array(z.string()).min(1, "Escolha ao menos uma pessoa."),
  prazo: z.string(),
  hora: z.string(),
  observacao: z.string(),
  ativo: z.boolean(),
  avisar: z.boolean(),
});
type Dados = z.infer<typeof esquema>;

/**
 * FORMULÁRIO: React Hook Form + Zod. Grupos com título em caixa alta, 2 colunas quando cabe,
 * erro embaixo do campo (em vermelho) e repetido num balão ao salvar. Ações no rodapé, à direita.
 */
export function TelaFormulario({ aoVoltar }: { aoVoltar: () => void }) {
  const [erroGeral, setErroGeral] = useState("");
  const { register, control, handleSubmit, formState } = useForm<Dados>({
    resolver: zodResolver(esquema),
    defaultValues: { nome: "", codigo: "", contato: "", categoria: "Categoria A", equipe: [], prazo: "", hora: "", observacao: "", ativo: true, avisar: false },
  });
  const e = formState.errors;

  return (
    <div className="pb-10">
      <CabecalhoTela titulo="Novo cadastro" subtitulo="Os campos com erro ficam vermelhos e explicam o que falta." />
      <form
        onSubmit={handleSubmit(
          () => {
            setErroGeral("");
            toast.success("Salvo (exemplo).");
          },
          () => setErroGeral("Confira os campos marcados em vermelho."),
        )}
        className="mx-6 max-w-3xl rounded-[20px] border border-borda bg-superficie p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      >
        <TituloGrupo>Identificação</TituloGrupo>
        <div className="grid gap-4 @2xl:grid-cols-2">
          <div>
            <CampoRotulado rotulo="Nome" placeholder="Ex.: Projeto Alfa" aria-invalid={!!e.nome} className={cn(e.nome && "border-vermelho/50 ring-4 ring-vermelho/10")} {...register("nome")} />
            <ErroDoCampo texto={e.nome?.message} />
          </div>
          <div>
            <CampoRotulado rotulo="Código" placeholder="0000-0" dica="Quatro números, traço e um número." aria-invalid={!!e.codigo} className={cn(e.codigo && "border-vermelho/50 ring-4 ring-vermelho/10")} {...register("codigo")} />
            <ErroDoCampo texto={e.codigo?.message} />
          </div>
          <div>
            <CampoRotulado rotulo="E-mail de contato" placeholder="nome@exemplo.com" aria-invalid={!!e.contato} className={cn(e.contato && "border-vermelho/50 ring-4 ring-vermelho/10")} {...register("contato")} />
            <ErroDoCampo texto={e.contato?.message} />
          </div>
          <Controller control={control} name="categoria" render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-texto-2">Categoria</span>
              <Escolha valor={field.value} aoMudar={field.onChange} itens={["Categoria A", "Categoria B", "Categoria C"].map((c) => ({ valor: c, rotulo: c }))} />
            </div>
          )} />
        </div>

        <div className="my-6 h-px bg-borda" />
        <TituloGrupo>Equipe e prazo</TituloGrupo>
        <div className="grid gap-4 @2xl:grid-cols-2">
          <Controller control={control} name="equipe" render={({ field }) => (
            <div>
              <Lista rotulo="Equipe" multipla buscavel itens={PESSOAS_EXEMPLO.map((p) => ({ valor: p, rotulo: p }))} valor={field.value} aoMudar={field.onChange} />
              {e.equipe && <span className="mt-1.5 block text-[12px] text-vermelho">{e.equipe.message}</span>}
            </div>
          )} />
          <div className="grid grid-cols-2 gap-3">
            <Controller control={control} name="prazo" render={({ field }) => <SeletorData rotulo="Prazo" valor={field.value} aoMudar={field.onChange} />} />
            <Controller control={control} name="hora" render={({ field }) => <SeletorHora rotulo="Hora" valor={field.value} aoMudar={field.onChange} />} />
          </div>
        </div>

        <div className="mt-4">
          <AreaTexto rotulo="Observação" placeholder="Opcional" {...register("observacao")} />
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <Controller control={control} name="ativo" render={({ field }) => <Interruptor rotulo="Ativo" ligado={field.value} aoMudar={field.onChange} />} />
          <Controller control={control} name="avisar" render={({ field }) => <CaixaSelecao rotulo="Avisar a equipe por e-mail" marcado={field.value} aoMudar={field.onChange} />} />
        </div>

        <AvisoErro texto={erroGeral} className="mt-5" />

        <div className="mt-6 flex justify-end gap-2 border-t border-borda pt-5">
          <Botao type="button" variante="leve" onClick={aoVoltar}>Cancelar</Botao>
          <Botao type="submit" variante="verde" carregando={formState.isSubmitting}>Salvar</Botao>
        </div>
      </form>
    </div>
  );
}
