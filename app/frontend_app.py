"""
AgriSmart AI - Unified Conversational Crop Health & Agronomy AI Assistant
A single, elegant Chatbot Interface (like ChatGPT / Gemini for Agriculture).
Features:
- Image Upload / Camera Leaf Diagnosis directly in Chat
- Grounded RAG ICAR/TNAU Treatment & Pathogen Biology
- Live Satellite Agrometeorology (Open-Meteo & FAO-56 Penman-Monteith)
- Autonomous Irrigation & Chemical Spray Window Guidance
- 25,410 Agricultural Expert Q&A Knowledge
"""

import os
import json
import tempfile
import streamlit as st
import streamlit.components.v1 as components
from PIL import Image

# 1. Page Configuration
st.set_page_config(
    page_title="AgriSmart AI - Autonomous Crop Health Advisor",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 2. Premium Chatbot Styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    /* Header */
    .chat-header-title {
        font-size: 2.1rem;
        font-weight: 800;
        background: linear-gradient(135deg, #15803d 0%, #0d9488 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0px;
        letter-spacing: -0.5px;
    }
    .chat-header-sub {
        font-size: 0.95rem;
        color: #6b7280;
        margin-bottom: 1.2rem;
        font-weight: 500;
    }
    
    /* Sleek Result Cards inside Chat */
    .diagnosis-bubble {
        background: #ffffff;
        color: #1f2937;
        border-radius: 12px;
        padding: 16px 20px;
        border: 1px solid #e5e7eb;
        border-left: 6px solid #16a34a;
        margin-top: 10px;
        margin-bottom: 12px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    }
    .diagnosis-bubble b {
        color: #15803d;
        font-size: 1.05rem;
    }
    
    .treatment-bubble {
        background: #f8fafc;
        color: #1e293b;
        border-radius: 12px;
        padding: 16px 20px;
        border: 1px solid #e2e8f0;
        border-left: 6px solid #7c3aed;
        margin-top: 10px;
        margin-bottom: 12px;
    }
    .treatment-bubble b {
        color: #6d28d9;
        font-size: 1.05rem;
    }
    
    .weather-bubble {
        background: #f0fdf4;
        color: #14532d;
        border-radius: 12px;
        padding: 14px 18px;
        border: 1px solid #bbf7d0;
        border-left: 6px solid #059669;
        margin-top: 10px;
        margin-bottom: 12px;
    }
    
    .chip-btn {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 20px;
        background: #f3f4f6;
        color: #374151;
        font-size: 0.85rem;
        font-weight: 600;
        border: 1px solid #d1d5db;
        margin-right: 8px;
        margin-bottom: 8px;
    }
</style>
""", unsafe_allow_html=True)

# 3. Backend Module Imports
from src.cv_pipeline.predict import predict
from src.advisor.agentic_advisor import AgenticAdvisor
from src.rag_pipeline.retriever import AgronomyRetriever, search_agri_qa, retrieve_agri_guidance
from src.advisor.weather_service import WeatherService, geocode_location, fetch_live_agri_weather, detect_device_location, reverse_geocode_gps
from src.advisor.soil_database import infer_soil_from_location

advisor = AgenticAdvisor()

# 4. Initialize State for Location & Chat
if "farm_location_input" not in st.session_state:
    init_loc = detect_device_location()
    st.session_state["farm_location_input"] = init_loc["name"]
    st.session_state["location_detected_online"] = init_loc.get("detected_online", False)

if "chat_history" not in st.session_state:
    st.session_state["chat_history"] = [
        {
            "role": "assistant",
            "type": "welcome",
            "content": (
                "🌱 **Namaste! I am your AI Agronomist Assistant.**\n\n"
                "You can **upload/snap a photo of an infected leaf**, or **ask any farming question** (pests, disease treatments, seed varieties, irrigation timing).\n\n"
                "Upload a crop photo below or click a quick prompt to begin!"
            )
        }
    ]

# 5. Location Synchronization Helper
def sync_location():
    if "sidebar_loc_key" in st.session_state:
        st.session_state["farm_location_input"] = st.session_state["sidebar_loc_key"]

active_location = st.session_state.get("farm_location_input", "Ahmedabad, Gujarat")

# 6. Sidebar: Field Telemetry & AI Model Selector
with st.sidebar:
    try:
        st.image("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400", use_container_width=True)
    except Exception:
        st.image("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400")
    
    st.title("🚜 Farm & Satellite Controls")
    
    # Farm Location Input & Auto GPS Detect
    st.markdown("<b>📍 Farm Location:</b>", unsafe_allow_html=True)
    loc_col1, loc_col2 = st.columns([3, 1])
    with loc_col1:
        active_location = st.text_input(
            "Farm Location", 
            value=active_location, 
            key="sidebar_loc_key", 
            on_change=sync_location, 
            label_visibility="collapsed"
        )
    with loc_col2:
        if st.button("📍 GPS", help="Detect current live GPS / Device location", use_container_width=True):
            det = detect_device_location()
            st.session_state["farm_location_input"] = det["name"]
            st.session_state["location_detected_online"] = det.get("detected_online", False)
            st.rerun()

    # If GPS permission is off, display notice
    if not st.session_state.get("location_detected_online", True):
        st.warning("⚠️ Location access is OFF / Blocked. Type your District above.")

    # Live Satellite & Soil Telemetry
    geo = geocode_location(active_location)
    live_weather = fetch_live_agri_weather(geo["lat"], geo["lon"], geo["name"])
    inferred_soil = infer_soil_from_location(active_location)
    
    st.markdown("---")
    st.markdown(f"**🛰️ Live Satellite ({geo['name']}):**")
    sc1, sc2 = st.columns(2)
    sc1.metric("🌡️ Temp", f"{live_weather['temperature_c']}°C")
    sc2.metric("💧 Humidity", f"{live_weather['humidity_pct']}%")
    
    sc3, sc4 = st.columns(2)
    sc3.metric("🌧️ Rain Risk", f"{live_weather['rain_probability_pct']}%")
    sc4.metric("🌱 Soil Moisture", f"{live_weather['soil_moisture_pct']}%")
    
    st.caption(f"**Dominant Soil (ICAR):** {inferred_soil['inferred_soil']} ({inferred_soil['detailed_texture']})")
    
    st.markdown("---")
    st.subheader("🤖 AI Vision Backbone")
    model_choice = st.selectbox(
        "Vision Model:",
        [
            "🥇 EfficientNet-B0 (99.80% Acc - Primary Web API)",
            "📱 MobileNet-V3 (99.53% Acc - Mobile Edge Model)"
        ]
    )
    engine_key = "efficientnet"
    if "MobileNet" in model_choice:
        engine_key = "mobilenet"

    if st.button("🗑️ Clear Chat History", use_container_width=True):
        st.session_state["chat_history"] = []
        st.rerun()

# HTML5 GPS Auto-Request Bridge
components.html("""
<script>
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        function(pos) {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const url = new URL(window.parent.location.href);
            if (url.searchParams.get('gps_lat') != lat.toFixed(4)) {
                url.searchParams.set('gps_lat', lat.toFixed(4));
                url.searchParams.set('gps_lon', lon.toFixed(4));
                window.parent.location.href = url.href;
            }
        },
        function(err) {},
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 0 }
    );
}
</script>
""", height=0, width=0)

# 7. Main Application Header
st.markdown('<div class="chat-header-title">🌾 AgriSmart AI: Crop Health & Agronomy Assistant</div>', unsafe_allow_html=True)
st.markdown(f'<div class="chat-header-sub">Connected to: <b>{geo["name"]}</b> • Real-Time Satellite Telemetry & ICAR Grounded RAG</div>', unsafe_allow_html=True)

# 8. Quick Suggested Question Chips
chip_cols = st.columns(4)
suggested_query = None
if chip_cols[0].button("🐛 Sugarcane Aphids", use_container_width=True):
    suggested_query = "What is the recommended pesticide dosage for aphids in sugarcane?"
if chip_cols[1].button("🍅 Tomato Early Blight", use_container_width=True):
    suggested_query = "How to treat Tomato Early Blight using organic and chemical controls?"
if chip_cols[2].button("🌾 High Yield Okra", use_container_width=True):
    suggested_query = "What are the recommended high yield varieties of Okra?"
if chip_cols[3].button("🌧️ Spray Window Weather", use_container_width=True):
    suggested_query = f"Is the weather suitable for foliar chemical spraying in {geo['name']} today?"

# 9. Test with a Sample Leaf
# Process Image Trigger
active_image_path = None


# 10. Render Chat History Stream
for msg in st.session_state["chat_history"]:
    with st.chat_message(msg["role"], avatar="🧑‍🌾" if msg["role"] == "user" else "🌱"):
        if msg.get("image_path") and os.path.exists(msg["image_path"]):
            try:
                st.image(Image.open(msg["image_path"]), caption="Diagnosed Leaf Image", width=280)
            except Exception:
                pass
        st.markdown(msg["content"], unsafe_allow_html=True)

# 11. Handle New Interactions (Text or Image)
prompt_data = st.chat_input("Ask any agricultural question or upload an image...", accept_file="multiple")

user_text = None
if prompt_data:
    if hasattr(prompt_data, "text") or hasattr(prompt_data, "get"):
        user_text = prompt_data.text if hasattr(prompt_data, "text") else prompt_data.get("text", "")
        files = prompt_data.files if hasattr(prompt_data, "files") else prompt_data.get("files", [])
        if files:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                tmp.write(files[0].getvalue())
                active_image_path = tmp.name
    else:
        user_text = prompt_data

query_to_run = suggested_query if suggested_query else user_text

# A. If Image was Submitted
if active_image_path and (len(st.session_state["chat_history"]) == 0 or st.session_state["chat_history"][-1].get("image_path") != active_image_path):
    msg_content = query_to_run if query_to_run else f"Please diagnose this crop leaf image for my farm in **{geo['name']}**."
    
    # Add User Image Msg
    st.session_state["chat_history"].append({
        "role": "user",
        "content": msg_content,
        "image_path": active_image_path
    })
    
    with st.chat_message("user", avatar="🧑‍🌾"):
        st.image(Image.open(active_image_path), caption="Uploaded Crop Leaf", width=280)
        st.markdown(msg_content)

    with st.chat_message("assistant", avatar="🌱"):
        with st.spinner(f"Analyzing leaf symptoms with {model_choice.split()[1]} & querying ICAR Knowledge Base..."):
            pred = predict(active_image_path, model_type=engine_key)
            disease = pred["disease"]
            conf = pred["confidence"]
            crop = pred["crop"]
            is_healthy = "healthy" in disease.lower()

            # Retrieve Grounded RAG details
            rag_info = retrieve_agri_guidance(disease)
            
            # Autonomous Advisory with Live Satellite Telemetry
            sensors = {
                "node_id": f"SAT-{geo['name'].upper()[:4]}",
                "soil_type": inferred_soil["inferred_soil"],
                "soil_moisture_pct": live_weather["soil_moisture_pct"],
                "soil_moisture_status": "Deficit - Irrigate" if live_weather["soil_moisture_pct"] < 30 else "Optimal",
                "soil_ph": 6.8,
                "soil_temp_c": round(live_weather["temperature_c"] - 2.5, 1),
                "nutrients_npk": {"nitrogen_mg_kg": 160, "phosphorus_mg_kg": 45, "potassium_mg_kg": 205}
            }
            advisory = advisor.formulate_advisory(
                disease,
                conf,
                user_location=geo["name"],
                custom_weather=live_weather,
                custom_sensors=sensors
            )
            decisions = advisory["actionable_decisions"]

            # Build Full Comprehensive Chat Bubble Response
            status_icon = "✅" if is_healthy else "⚠️"
            response_html = f"""
            <div class="diagnosis-bubble">
                <b>{status_icon} AI Diagnosis Result:</b> <b>{disease}</b><br>
                • <b>Crop:</b> {crop} | <b>Confidence:</b> {conf*100:.2f}% | <b>Engine:</b> <code>{engine_key}</code><br>
                • <b>Farm Location:</b> {geo['name']} ({inferred_soil['inferred_soil']})
            </div>
            
            <div class="treatment-bubble">
                <b>📖 Verified Agronomic Treatment & Biology (ICAR Grounded):</b><br><br>
                {rag_info['retrieved_context'].replace(chr(10), '<br>')}
            </div>
            
            <div class="weather-bubble">
                <b>🛰️ Autonomous Live Satellite Actions ({geo['name']}):</b><br>
                • <b>💧 Smart Irrigation:</b> {decisions['smart_irrigation']}<br>
                • <b>🧪 Chemical Spray Window:</b> {decisions['chemical_spray_window']}<br>
                • <b>🌍 Sustainability Index:</b> <b>{decisions['sustainability_index']}</b> (Est. water conserved: {decisions['water_conservation_estimate_liters']} L/acre)
            </div>
            """
            st.markdown(response_html, unsafe_allow_html=True)
            st.session_state["chat_history"].append({"role": "assistant", "content": response_html})

# B. If Text Question was Submitted
elif query_to_run:
    st.session_state["chat_history"].append({"role": "user", "content": query_to_run})
    with st.chat_message("user", avatar="🧑‍🌾"):
        st.markdown(query_to_run)

    with st.chat_message("assistant", avatar="🌱"):
        with st.spinner("Searching ChromaDB Agronomy Vector Database..."):
            query_lower = query_to_run.lower()
            
            # Weather & Spray Inquiry
            if any(w in query_lower for w in ["spray", "irrigate", "weather", "rain", "wind", "water"]):
                rain_risk = live_weather["rain_probability_pct"] >= 50
                wind_risk = live_weather["wind_speed_kmh"] > 15
                
                resp = f"🌦️ **Live Agrometeorological Assessment for {geo['name']}:**\n\n"
                resp += f"- **Temperature:** `{live_weather['temperature_c']} °C` | **Humidity:** `{live_weather['humidity_pct']}%`\n"
                resp += f"- **Precipitation Probability:** `{live_weather['rain_probability_pct']}%` | **Wind:** `{live_weather['wind_speed_kmh']} km/h`\n"
                resp += f"- **Satellite Soil Moisture (0-9cm):** `{live_weather['soil_moisture_pct']}%` (FAO-56 ET₀: `{live_weather.get('et0_fao_evapotranspiration_mm_day', 4.2)} mm/day`)\n\n"
                
                if rain_risk:
                    resp += "🚨 **Chemical Spray Recommendation:** **HOLD SPRAY.** High probability of precipitation within 24h will wash off foliar chemicals.\n"
                elif wind_risk:
                    resp += f"⚠️ **Chemical Spray Recommendation:** **HIGH DRIFT RISK.** Wind speed is {live_weather['wind_speed_kmh']} km/h. Spray early morning when winds are calm (<10 km/h).\n"
                else:
                    resp += "✅ **Chemical Spray Recommendation:** **OPTIMAL SPRAY WINDOW.** Calm winds and moderate humidity.\n"
                    
                if live_weather['soil_moisture_pct'] < 30:
                    resp += "\n💧 **Irrigation Advice:** Soil moisture is low. Schedule drip irrigation in early morning."
                else:
                    resp += f"\n✅ **Irrigation Advice:** Soil moisture is adequate ({live_weather['soil_moisture_pct']}%). Conserve water."
                    
                resp += "\n\n*(Source: Open-Meteo Satellite & FAO-56 Models)*"
            else:
                # Vector Search in ChromaDB QA & Textbooks
                qa_hits = search_agri_qa(query_to_run, n_results=2)
                disease_guidance = retrieve_agri_guidance(query_to_run)
                
                resp = ""
                if qa_hits:
                    for hit in qa_hits:
                        if "Answer:" in hit:
                            a = hit.split("Answer:")[1].strip()
                            resp += f"💡 **Expert Solution:**\n{a}\n\n"
                        else:
                            resp += f"{hit}\n\n"
                
                if "Maintain standard" not in disease_guidance.get("retrieved_context", ""):
                    resp += f"📖 **ICAR/TNAU Standard Treatment Protocol:**\n\n```\n{disease_guidance['retrieved_context']}\n```\n"
                    
                if not resp.strip():
                    resp = f"Here is the standard agronomic recommendation for **{query_to_run}**:\n\n- Apply balanced NPK fertilizers.\n- Practice crop rotation with leguminous crops.\n- Use certified resistant seeds and consult your local Krishi Vigyan Kendra (KVK)."
                    
                resp += f"\n*(Grounded by: {disease_guidance.get('source', 'ChromaDB Agronomy Vector Database')})*"

            st.markdown(resp)
            st.session_state["chat_history"].append({"role": "assistant", "content": resp})
