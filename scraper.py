import argparse
import requests
from bs4 import BeautifulSoup
from models import Imovel
from utils import salvar_dados
from config import settings
import time

def main():
    """Função principal para gerar um arquivo de saída com dados de exemplo."""
    parser = argparse.ArgumentParser(description="Gera um arquivo de saída com dados de exemplo")
    parser.add_argument("--limit", type=int, default=5, help="Número máximo de imóveis para gerar")
    parser.add_argument("--output-dir", type=str, default=settings.DEFAULT_OUTPUT_DIR, help="Diretório de saída")
    parser.add_argument("--formato", type=str, default=",".join(settings.DEFAULT_FORMATS), help="Formatos de saída (json,csv)")
    args = parser.parse_args()

    imoveis = [
        Imovel(titulo="Apartamento de exemplo 1", link="http://example.com/1"),
        Imovel(titulo="Apartamento de exemplo 2", link="http://example.com/2"),
        Imovel(titulo="Apartamento de exemplo 3", link="http://example.com/3"),
        Imovel(titulo="Apartamento de exemplo 4", link="http://example.com/4"),
        Imovel(titulo="Apartamento de exemplo 5", link="http://example.com/5"),
    ]

    # Limitar o número de imóveis conforme o argumento
    imoveis = imoveis[:args.limit]

    if imoveis:
        formatos = [f.strip() for f in args.formato.split(',')]
        salvar_dados(imoveis, args.output_dir, formatos)
        print(f"\nArquivo de exemplo gerado com {len(imoveis)} imóveis.")
    else:
        print("Nenhum imóvel de exemplo foi gerado.")

if __name__ == "__main__":
    main()
