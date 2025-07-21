import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")
    DEFAULT_URL = "https://www.vivareal.com.br"
    DEFAULT_LIMIT = 50
    DEFAULT_OUTPUT_DIR = "./output"
    DEFAULT_FORMATS = ["json", "csv"]

settings = Settings()
