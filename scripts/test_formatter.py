import re
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def format_agronomist_field_assessment(text: str) -> str:
    if not text or not text.strip():
        return ""
    text = text.strip()
    if text.startswith("Answer:"):
        text = text[7:].strip()
    pattern = r'(?:^|\s)(?:(1\.\s*Diagnosis & Pathogen|2\.\s*Targeted Chemical Control|3\.\s*Organic\s*(?:/|–|-)?\s*(?:Biological|Agricultural)?\s*Alternative|4\.\s*Live Weather\s*(?:&|and)?\s*Cultural Prevention|\b[1-4]\.\s+[A-Z][A-Za-z\s/&–-]+):\s*)'
    parts = re.split(pattern, text)
    if len(parts) > 2:
        formatted_html = []
        i = 1
        while i < len(parts):
            header = parts[i].strip() if parts[i] else ""
            content = parts[i+1].strip() if i+1 < len(parts) and parts[i+1] else ""
            h_lower = header.lower()
            if "diagnosis" in h_lower or "pathogen" in h_lower:
                icon = "🔍"
                title = "Diagnosis & Symptoms"
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
            content = re.sub(r'^(The predicted (disease|cause|model|result|crop) is|Likely cause:)\s*', '', content, flags=re.IGNORECASE).strip()
            if content:
                formatted_html.append(
                    f'<div style="margin-bottom:8px; line-height:1.55;">'
                    f'<span style="font-weight:700; color:#0f766e;">{icon} {title}:</span> '
                    f'<span style="color:#1e293b;">{content}</span>'
                    f'</div>'
                )
            i += 2
        if formatted_html:
            return "".join(formatted_html)
    return f'<div style="line-height:1.55; color:#1e293b;">{text}</div>'

sample = '''1. Diagnosis & Pathogen: The predicted cause is Tomato Early blight. Likely cause: Alternaria solani. Older leaves develop brown lesions with concentric rings and a yellow halo; severe infection causes premature defoliation. Apply only if the crop disease and disease are covered by the current local rate. 2. Targeted Chemical Control: Do not use a universal product rate from this dataset. Select only a locally registered tomato product with a registered seed/seedling label and certified organic matter as a crop-stage advisory. 3. Organic / Biological Alternative: Remove lower infected leaves promptly and destroy debris. Use Trichoderma viride @ 2.5 kg/acre mixed into well-decomposed FYM according to the nutrient plan and water volume. 4. Live Weather & Cultural Prevention: Rain Probability: 100%, Wind Speed: 6.2 km/h. Avoid application if rain is expected within 4-6 hours or wind exceeds 12 km/hour. Improve canopy airflow, avoid prolonged leaf wetness and maintain plant spacing. Use PPE, respect the pre-harvest interval, and follow the product label.'''

result = format_agronomist_field_assessment(sample)
print(result)
