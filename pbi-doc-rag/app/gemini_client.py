import time
from google import genai
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

# gemini-2.0-flash-lite has a separate (higher) free-tier quota
MODEL_ID = "gemini-2.0-flash-lite"


def generate_with_retry(prompt: str, system: str, retries: int = 3) -> str:
    """Call generate_content with exponential backoff on 429."""
    delay = 30
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompt,
                config={"system_instruction": system},
            )
            return response.text or ""
        except Exception as exc:
            msg = str(exc)
            if "429" in msg and attempt < retries - 1:
                print(f"[gemini] Rate limited, retrying in {delay}s…")
                time.sleep(delay)
                delay *= 2
            else:
                raise
