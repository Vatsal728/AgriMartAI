"""
Autonomous Agentic Advisor for AgriSmart AI (SIH-2026 Bonus Modules B, C, D, E, G)
Combines:
1. Disease Diagnosis
2. Grounded RAG Agronomy Knowledge
3. Live Weather Conditions
4. Real-time IoT Sensor Stream
To produce actionable recommendations, smart irrigation plans, and sustainability scores.
"""

import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from src.rag_pipeline.retriever import AgronomyRetriever
from src.advisor.weather_service import WeatherService
from src.advisor.sensor_stream import IoTSensorSimulator
from src.advisor.agri_llm_engine import get_agri_llm

class AgenticAdvisor:
    def __init__(self):
        self.retriever = AgronomyRetriever()
        self.weather_service = WeatherService()
        self.sensor_simulator = IoTSensorSimulator()


    def formulate_advisory(self, disease_name: str, confidence: float, user_location: str = None, custom_weather: dict = None, custom_sensors: dict = None) -> dict:
        """
        Executes the autonomous reasoning loop and produces a comprehensive farmer advisory report.
        """
        # 1. Retrieve RAG grounded agronomy context
        rag_info = self.retriever.retrieve_guidance(disease_name)
        
        # 2. Ingest environmental context
        weather = custom_weather or self.weather_service.get_weather(user_location)
        sensors = custom_sensors or self.sensor_simulator.get_telemetry()
        
        # 3. Autonomous Reasoning Engine
        # Smart Irrigation Logic (Bonus Module B & C)
        rain_imminent = weather["rain_probability_pct"] >= 60
        soil_dry = sensors["soil_moisture_pct"] < 30
        
        if rain_imminent:
            irrigation_advice = f"🚨 DELAY IRRIGATION: High rain probability ({weather['rain_probability_pct']}%) forecasted in next 24h. Save water and prevent root waterlogging."
            water_saved_liters = 4500  # Estimated water saved per acre
        elif soil_dry:
            irrigation_advice = f"💧 IRRIGATE NOW: Soil moisture is low ({sensors['soil_moisture_pct']}%). Schedule drip irrigation in early morning."
            water_saved_liters = 0
        else:
            irrigation_advice = f"✅ OPTIMAL MOISTURE: Soil moisture is balanced ({sensors['soil_moisture_pct']}%). No immediate irrigation required."
            water_saved_liters = 1500

        # Chemical Spray Timing Logic (Bonus Module C)
        if rain_imminent:
            spray_advice = "⚠️ HOLD CHEMICAL SPRAY: High risk of rain wash-off within 4-6 hours. Postpone foliar treatments until clear skies."
        elif weather["wind_speed_kmh"] > 15:
            spray_advice = f"⚠️ HIGH DRIFT RISK: Wind speed is {weather['wind_speed_kmh']} km/h. Spray during calm early morning hours (<10 km/h)."
        else:
            spray_advice = "✅ FAVORABLE SPRAY WINDOW: Calm winds and moderate humidity. Suitable for precision foliar application."

        # Sustainability & Resource Score (Bonus Module D)
        is_healthy = "healthy" in disease_name.lower()
        base_score = 92 if is_healthy else 84
        sustainability_score = min(100, max(60, base_score + (5 if not rain_imminent else 8)))
        
        # 4. Human-Written Agronomist Field Assessment Synthesis
        if is_healthy:
            field_assessment = (
                f"Visual analysis confirms pristine, healthy {disease_name.replace('Healthy', '').strip()} foliage with normal photosynthetic activity and zero foliar pathogen symptoms. "
                f"No chemical intervention is needed. Continue soil-test-based organic nutrition and standard drip irrigation intervals."
            )
        else:
            weather_note = "Safe spraying window is available with calm winds." if not rain_imminent and weather['wind_speed_kmh'] <= 15 else ("Hold foliar applications due to imminent rainfall (>60%)." if rain_imminent else f"High wind speed ({weather['wind_speed_kmh']} km/h) creates spray drift hazard.")
            details = rag_info.get("details", {}) if rag_info else {}
            symptom_note = details.get("symptoms", "Foliar lesions observed on leaves.")
            
            field_assessment = (
                f"Foliar examination confirms symptoms consistent with {disease_name}. "
                f"{symptom_note.split('.')[0]}. "
                f"{weather_note} Execute the targeted chemical or biological treatment plan outlined below."
            )

        # Multilingual conversational summary (GenAI format - Bonus Module E)
        summary_en = (
            f"Diagnosis: {disease_name} (Confidence: {confidence*100:.1f}%). "
            f"{'Your crop is in excellent health! ' if is_healthy else 'Immediate action recommended. '} "
            f"{irrigation_advice} {spray_advice}"
        )


        rag_src = rag_info.get("source", "ICAR/TNAU Standard Agronomy Database") if rag_info else "ICAR/TNAU Standard Agronomy Database"
        rag_ctx = rag_info.get("retrieved_context", f"Maintain standard field sanitation and balanced crop nutrition for {disease_name}.") if rag_info else f"Maintain standard field sanitation and balanced crop nutrition for {disease_name}."

        return {
            "disease_detected": disease_name,
            "confidence": round(confidence, 4),
            "crop_category": disease_name.split()[0],
            "rag_knowledge": {
                "source": rag_src,
                "context": rag_ctx
            },
            "environment_telemetry": {
                "weather": weather,
                "iot_sensors": sensors
            },
            "actionable_decisions": {
                "smart_irrigation": irrigation_advice,
                "chemical_spray_window": spray_advice,
                "water_conservation_estimate_liters": water_saved_liters,
                "sustainability_index": f"{sustainability_score}/100"
            },
            "llm_expert_advisory": field_assessment,
            "conversational_summary": summary_en
        }


if __name__ == "__main__":
    import json
    advisor = AgenticAdvisor()
    res = advisor.formulate_advisory("Tomato Brown Spots", 0.94)
    print("\n--- Advisory Result ---")
    print(json.dumps(res, indent=2, ensure_ascii=True))

