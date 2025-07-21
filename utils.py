import json
import pandas as pd
import os
from typing import List
from models import Imovel

def salvar_dados(imoveis: List[Imovel], output_dir: str, formatos: List[str]):
    """Salva os dados dos imóveis nos formatos especificados."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    imoveis_dict = [imovel.dict() for imovel in imoveis]

    if "json" in formatos:
        path = os.path.join(output_dir, "imoveis.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"imoveis": imoveis_dict}, f, ensure_ascii=False, indent=4)
        print(f"Dados salvos em {path}")

    if "csv" in formatos:
        df = pd.DataFrame(imoveis_dict)
        path = os.path.join(output_dir, "imoveis.csv")
        df.to_csv(path, index=False, encoding="utf-8")
        print(f"Dados salvos em {path}")
