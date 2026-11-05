"""Formato dos dados que chegam nas portas (Pydantic) — como em backend/esquemas/ do Plus."""
from pydantic import BaseModel


class NovoItem(BaseModel):
    nome: str
    codigo: str = ""
