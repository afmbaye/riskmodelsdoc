from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY: str = os.environ["GEMINI_API_KEY"]
FILE_SEARCH_STORE_NAME: str = os.getenv("FILE_SEARCH_STORE_NAME", "pbi-doc-store")
