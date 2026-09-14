"""
Local Fine-Tuned Agronomy LLM Engine for AgriSmart AI
Uses google/flan-t5-base with trained LoRA adapter (models/agri_flan_t5_expert).
Provides fast, offline, deterministic agronomic reasoning and conversational capabilities.
"""

import os

# Ensure OpenMP stability on Windows before importing torch
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from peft import PeftModel

BASE_MODEL_NAME = "google/flan-t5-base"
ADAPTER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models", "agri_flan_t5_expert"))

class LocalAgriLLM:
    _instance = None

    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = None
        self.model = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        if not os.path.exists(ADAPTER_PATH):
            print(f"[AgriLLM Warning] LoRA adapter path not found: {ADAPTER_PATH}. Will fallback to rule-based RAG.")
            return

        try:
            device_info = f"GPU: {torch.cuda.get_device_name(0)}" if self.device == "cuda" else "CPU"
            print(f"[AgriLLM] Loading tokenizer & base model ({BASE_MODEL_NAME}) on {device_info}...")
            
            # 1. Try offline local files first to avoid slow HF Hub network rate limits
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME, local_files_only=True)
                base_model = AutoModelForSeq2SeqLM.from_pretrained(
                    BASE_MODEL_NAME,
                    dtype=torch.float16 if self.device == "cuda" else torch.float32,
                    device_map="auto" if self.device == "cuda" else None,
                    local_files_only=True
                )
            except Exception:
                self.tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME)
                base_model = AutoModelForSeq2SeqLM.from_pretrained(
                    BASE_MODEL_NAME,
                    dtype=torch.float16 if self.device == "cuda" else torch.float32,
                    device_map="auto" if self.device == "cuda" else None
                )
            
            print(f"[AgriLLM] Injecting trained LoRA expert adapter from {ADAPTER_PATH}...")
            self.model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
            self.model.eval()
            self.is_loaded = True
            
            if self.device == "cuda":
                vram_mb = torch.cuda.memory_allocated(0) / (1024 * 1024)
                print(f"[AgriLLM] Fine-tuned AgriMart LLM loaded and active on {device_info} (VRAM: {vram_mb:.1f} MB)!")
            else:
                print(f"[AgriLLM] Fine-tuned AgriMart LLM loaded on CPU!")
        except Exception as e:
            print(f"[AgriLLM Error] Failed loading local model: {e}")
            self.is_loaded = False

    def generate_advisory(self, instruction: str, context: str = "", max_tokens: int = 120) -> str:
        """
        Runs fast GPU generation using the fine-tuned AgriMart LLM model.
        Synthesizes output into natural, professional conversational advice.
        """
        if not self.is_loaded or self.model is None or self.tokenizer is None:
            return ""

        prompt = f"Agricultural Advisory Task:\n{instruction}"
        if context:
            prompt += f"\nContext: {context}"
        prompt += "\nAnswer:"

        try:
            device = self.model.device if hasattr(self.model, "device") else self.device
            inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=160).to(device)
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=max_tokens,
                    repetition_penalty=1.25,
                    no_repeat_ngram_size=3,
                    do_sample=False,
                    num_beams=1,
                    pad_token_id=self.tokenizer.pad_token_id,
                    eos_token_id=self.tokenizer.eos_token_id
                )
            answer = self.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
            
            import re
            text = answer
            if text.startswith("Answer:"):
                text = text[7:].strip()
            
            # Format cleanly with regex splits
            return format_agri_advisory_text(text)
        except Exception as e:
            print(f"[AgriLLM Error during generate]: {e}")
            return ""


def clean_robotic_phrases(content: str) -> str:
    import re
    patterns = [
        r'The model disease is not a laboratory result\.?\s*',
        r'Use the symptom pattern to distinguish this disease from look-alike disorders\.?\s*',
        r'Never convert a rate by guesswork;?\s*',
        r'No spray is needed for a healthy or no-chemical profile\.?\s*',
        r'Apply only if the crop disease and disease are covered by the current [^.]+\.?\s*',
        r'Do not use fungicides that contain toxic waste\.?\s*',
        r'Do not use a universal product rate from this dataset\.?\s*',
        r'Select only a locally registered [^.]+ as a crop-stage advisory\.?\s*',
        r'^(The predicted (disease|cause|model|result|crop) is|Likely cause:)\s*'
    ]
    for p in patterns:
        content = re.sub(p, '', content, flags=re.IGNORECASE)
    content = content.replace("Rotine", "Routine").replace("vermicombpost", "vermicompost").replace("cartload", "cart-load")
    return re.sub(r'\s+', ' ', content).strip()


def format_agri_advisory_text(text: str) -> str:
    """
    Splits any 1. ... 2. ... 3. ... 4. ... raw LLM output into clean, well-spaced bullet sections.
    """
    if not text or not text.strip():
        return ""
    import re
    text = text.strip()
    if text.startswith("Answer:"):
        text = text[7:].strip()
    
    pattern = r'(?:^|\s)(?:(1\.\s*Diagnosis & Pathogen|2\.\s*Targeted Chemical Control|3\.\s*Organic\s*(?:/|–|-)?\s*(?:Biological|Agricultural)?\s*Alternative|4\.\s*Live Weather\s*(?:&|and)?\s*Cultural Prevention|\b[1-4]\.\s+[A-Z][A-Za-z\s/&–-]+):\s*)'
    parts = re.split(pattern, text)
    
    if len(parts) > 2:
        formatted_lines = []
        i = 1
        while i < len(parts):
            header = parts[i].strip() if parts[i] else ""
            content = parts[i+1].strip() if i+1 < len(parts) and parts[i+1] else ""
            
            h_lower = header.lower()
            if "diagnosis" in h_lower or "pathogen" in h_lower:
                icon = "🔍"
                title = "Diagnosis & Pathogen"
            elif "chemical" in h_lower or "control" in h_lower:
                icon = "🧪"
                title = "Targeted Chemical Action"
            elif "organic" in h_lower or "bio" in h_lower:
                icon = "🌿"
                title = "Organic & Biological Care"
            elif "weather" in h_lower or "cultural" in h_lower or "prevention" in h_lower:
                icon = "🌦️"
                title = "Live Weather & Cultural Care"
            else:
                icon = "📌"
                title = re.sub(r'^\d+\.\s*', '', header).rstrip(':')
            
            clean_content = clean_robotic_phrases(content)
            if clean_content:
                formatted_lines.append(f"{icon} **{title}:** {clean_content}")
            i += 2
            
        if formatted_lines:
            return "\n\n".join(formatted_lines)
            
    # Fallback cleanup
    return clean_robotic_phrases(text)


# Singleton helper
_GLOBAL_LLM = None

def get_agri_llm() -> LocalAgriLLM:
    global _GLOBAL_LLM
    if _GLOBAL_LLM is None:
        _GLOBAL_LLM = LocalAgriLLM()
    return _GLOBAL_LLM

