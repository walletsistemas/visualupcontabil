"""Junta os quadros (jpg) numa animação GIF, respeitando o tempo real entre eles.
Uso: python gif.py <pasta_dos_quadros> <saida.gif>   (chamado pelo fotografar.mjs)
"""
import json
import sys
from pathlib import Path

from PIL import Image

LARGURA = 800      # GIF leve o bastante para abrir no GitHub
INTERVALO = 90     # no máximo ~11 quadros por segundo

pasta, saida = Path(sys.argv[1]), Path(sys.argv[2])
tempos = json.loads((pasta / "tempos.json").read_text())
arquivos = sorted(pasta.glob("*.jpg"))[: len(tempos)]
if not arquivos:
    sys.exit("nenhum quadro gravado")
# descarta quadros muito próximos (o GIF fica menor e a animação continua fluida)
escolhidos, ultimo = [], -INTERVALO
for a, t in zip(arquivos, tempos):
    if t - ultimo >= INTERVALO:
        escolhidos.append((a, t))
        ultimo = t
arquivos, tempos = [a for a, _ in escolhidos], [t for _, t in escolhidos]
quadros = []
for a in arquivos:
    with Image.open(a) as im:
        alto = round(im.height * LARGURA / im.width)
        quadros.append(im.convert("RGB").resize((LARGURA, alto), Image.LANCZOS))
# quanto cada quadro fica na tela = o intervalo até o próximo (o último, 1,5 s)
duracoes = [max(20, b - a) for a, b in zip(tempos, tempos[1:])] + [1500]
paleta = quadros[len(quadros) // 2].quantize(colors=255, method=Image.Quantize.MEDIANCUT)
gif = [q.quantize(palette=paleta, dither=Image.Dither.NONE) for q in quadros]
gif[0].save(saida, save_all=True, append_images=gif[1:], duration=duracoes, loop=0, optimize=True, disposal=1)
print(f"  {saida.name}: {len(gif)} quadros, {saida.stat().st_size // 1024} KB")
