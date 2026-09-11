"""
IoT Sensor Telemetry Stream for AgriSmart AI (SIH-2026 Bonus Module F)
Simulates continuous real-time ESP32 / LoRaWAN agricultural telemetry (Moisture, pH, NPK, Temp).
"""

import random
import time
from datetime import datetime

class IoTSensorSimulator:
    def __init__(self, node_id="ESP32-AGRI-04"):
        self.node_id = node_id

    def get_telemetry(self, soil_type="Loamy") -> dict:
        """
        Generates realistic agricultural sensor telemetry values.
        """
        # Soil moisture percentage (20% - 45% is typical for arable fields)
        moisture = round(random.uniform(28.0, 42.0), 1)
        # Soil pH (6.0 - 7.2 is typical neutral/slightly acidic)
        ph_level = round(random.uniform(6.2, 7.1), 2)
        # Soil temperature (usually slightly lower than air temp)
        soil_temp = round(random.uniform(23.0, 27.5), 1)
        # NPK Macronutrient estimations in mg/kg (ppm)
        nitrogen_ppm = random.randint(120, 210)
        phosphorus_ppm = random.randint(35, 65)
        potassium_ppm = random.randint(160, 260)
        
        # Determine soil health status
        moisture_status = "Optimal" if 30 <= moisture <= 50 else ("Deficit - Irrigation Required" if moisture < 30 else "Excessive Moisture")

        return {
            "node_id": self.node_id,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "soil_type": soil_type,
            "soil_moisture_pct": moisture,
            "soil_moisture_status": moisture_status,
            "soil_ph": ph_level,
            "soil_temp_c": soil_temp,
            "nutrients_npk": {
                "nitrogen_mg_kg": nitrogen_ppm,
                "phosphorus_mg_kg": phosphorus_ppm,
                "potassium_mg_kg": potassium_ppm
            },
            "sensor_health": "Active / 100% Battery"
        }

if __name__ == "__main__":
    sensor = IoTSensorSimulator()
    print(sensor.get_telemetry())
