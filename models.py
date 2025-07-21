from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional

class Imovel(BaseModel):
    titulo: Optional[str] = Field(None, description="Título do anúncio do imóvel")
    endereco: Optional[str] = Field(None, description="Endereço ou localização do imóvel")
    preco: Optional[float] = Field(None, description="Preço de venda do imóvel")
    area: Optional[int] = Field(None, description="Área do imóvel em metros quadrados")
    quartos: Optional[int] = Field(None, description="Número de quartos")
    banheiros: Optional[int] = Field(None, description="Número de banheiros")
    vagas: Optional[int] = Field(None, description="Número de vagas de garagem")
    descricao: Optional[str] = Field(None, description="Descrição detalhada do imóvel")
    caracteristicas: Optional[List[str]] = Field(default_factory=list, description="Lista de características e amenidades")
    link: Optional[HttpUrl] = Field(None, description="Link do anúncio original")
    imagens: Optional[List[HttpUrl]] = Field(default_factory=list, description="URLs das imagens do imóvel")
    codigo: Optional[str] = Field(None, description="Código de referência do imóvel")
    imobiliaria: Optional[str] = Field(None, description="Nome da imobiliária ou corretor")

class ImovelList(BaseModel):
    imoveis: List[Imovel]
