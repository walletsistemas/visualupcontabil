"""Uma cópia do programa por computador (igual ao Plus: backend/janela/instancia.py).

Duas cópias usariam o MESMO rascunho e a mesma fila de envio ao servidor. A trava é um arquivo
na pasta gravável, travado pelo Windows enquanto o processo vive: se a cópia morrer, solta sozinha.
"""
import os


def travar(pasta: str):
    """Devolve o arquivo travado (manter aberto) ou None se já houver outra cópia."""
    f = open(os.path.join(pasta, "programa_aberto.lock"), "a+")
    try:
        if os.name == "nt":
            import msvcrt
            f.seek(0)
            msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        f.close()
        return None
    return f
