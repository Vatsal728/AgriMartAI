"""
AgriMartAI - Real-Time Satellite Weather & Agrometeorology Service
Powered by Open-Meteo (Free Open-Access Scientific Meteorological API)
Provides live temperature, humidity, wind, precipitation probability, and satellite soil moisture (0-9cm).
"""

import requests
from typing import Dict, Any, Optional

# Indian agricultural regions fallback coordinates
GEOCODE_CACHE = {
    "nashik": {"lat": 19.9975, "lon": 73.7898, "state": "Maharashtra", "crop_hub": "Grape/Onion Capital"},
    "ludhiana": {"lat": 30.9010, "lon": 75.8573, "state": "Punjab", "crop_hub": "Wheat/Rice Belt"},
    "surat": {"lat": 21.1702, "lon": 72.8311, "state": "Gujarat", "crop_hub": "Sugarcane/Vegetables"},
    "anand": {"lat": 22.5645, "lon": 72.9289, "state": "Gujarat", "crop_hub": "Tobacco/Dairy/Banana"},
    "guntur": {"lat": 16.3067, "lon": 80.4365, "state": "Andhra Pradesh", "crop_hub": "Chilli/Cotton Capital"},
    "shimla": {"lat": 31.1048, "lon": 77.1734, "state": "Himachal Pradesh", "crop_hub": "Apple Bowl of India"},
    "bhopal": {"lat": 23.2599, "lon": 77.4126, "state": "Madhya Pradesh", "crop_hub": "Soybean/Pulses Hub"},
    "nagpur": {"lat": 21.1458, "lon": 79.0882, "state": "Maharashtra", "crop_hub": "Orange City"},
    "varanasi": {"lat": 25.3176, "lon": 82.9739, "state": "Uttar Pradesh", "crop_hub": "Paddy/Wheat Belt"},
    "bengaluru": {"lat": 12.9716, "lon": 77.5946, "state": "Karnataka", "crop_hub": "Horticulture/Vegetables"},
    "ahmedabad": {"lat": 23.0225, "lon": 72.5714, "state": "Gujarat", "crop_hub": "Cotton/Wheat/Castor"}
}

def geocode_location(location_name: str) -> Dict[str, Any]:
    """Geocode any city/district globally using Open-Meteo Geocoding API."""
    loc_clean = location_name.strip().lower()
    if loc_clean in GEOCODE_CACHE:
        cached = GEOCODE_CACHE[loc_clean]
        return {
            "name": location_name.title(),
            "lat": cached["lat"],
            "lon": cached["lon"],
            "region": f"{cached['state']} ({cached['crop_hub']})"
        }
    
    # Live Geocoding lookup
    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={requests.utils.quote(location_name)}&count=1&language=en&format=json"
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if "results" in data and len(data["results"]) > 0:
                top = data["results"][0]
                return {
                    "name": top.get("name", location_name.title()),
                    "lat": top.get("latitude"),
                    "lon": top.get("longitude"),
                    "region": f"{top.get('admin1', '')}, {top.get('country', '')}".strip(", ")
                }
    except Exception as e:
        print(f"[WeatherService] Geocoding fallback: {e}")
        
    # Default fallback to central India
    return {
        "name": location_name.title() if location_name else "Field Location",
        "lat": 23.0225,
        "lon": 72.5714,
        "region": "India (Default Agricultural Zone)"
    }

def fetch_live_agri_weather(lat: float, lon: float, location_name: str = "Field Location") -> Dict[str, Any]:
    """
    Fetch real-time atmospheric & agricultural soil moisture data directly from Open-Meteo.
    """
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}&"
        f"current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index&"
        f"hourly=precipitation_probability,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm&"
        f"forecast_days=2&timezone=auto"
    )
    
    try:
        resp = requests.get(url, timeout=6)
        if resp.status_code == 200:
            raw = resp.json()
            curr = raw.get("current", {})
            hourly = raw.get("hourly", {})
            
            temp = float(curr.get("temperature_2m", 28.0))
            humidity = float(curr.get("relative_humidity_2m", 60.0))
            wind_speed = float(curr.get("wind_speed_10m", 8.0))
            rain_mm = float(curr.get("rain", 0.0))
            uv_index = float(curr.get("uv_index", 5.0))
            
            precip_prob_list = hourly.get("precipitation_probability", [0])[:12]
            rain_prob = max(precip_prob_list) if precip_prob_list else 0
            
            soil_0_1 = hourly.get("soil_moisture_0_to_1cm", [0.35])
            soil_1_3 = hourly.get("soil_moisture_1_to_3cm", [0.35])
            soil_3_9 = hourly.get("soil_moisture_3_to_9cm", [0.35])
            
            curr_soil_m3 = (soil_0_1[0] + soil_1_3[0] + soil_3_9[0]) / 3.0 if soil_0_1 and soil_1_3 and soil_3_9 else 0.35
            soil_moisture_pct = round(curr_soil_m3 * 100.0, 1)
            soil_moisture_pct = max(10.0, min(95.0, soil_moisture_pct))

            weather_desc = "Clear Skies"
            if rain_prob > 50 or rain_mm > 0:
                weather_desc = "Rain Forecasted"
            elif humidity > 80:
                weather_desc = "Humid / Overcast"

            return {
                "source": "Open-Meteo Satellite (Live)",
                "status": "success",
                "location": location_name,
                "lat": lat,
                "lon": lon,
                "temperature_c": temp,
                "humidity_pct": humidity,
                "wind_speed_kmh": wind_speed,
                "rain_probability_pct": rain_prob,
                "rain_mm": rain_mm,
                "soil_moisture_pct": soil_moisture_pct,
                "uv_index": uv_index,
                "conditions": weather_desc,
                "is_real_data": True
            }
    except Exception as e:
        print(f"[WeatherService] Weather fetch failed: {e}")

    return {
        "source": "Agronomy Baseline (Fallback)",
        "status": "fallback",
        "location": location_name,
        "lat": lat,
        "lon": lon,
        "temperature_c": 28.5,
        "humidity_pct": 65.0,
        "wind_speed_kmh": 8.0,
        "rain_probability_pct": 10,
        "rain_mm": 0.0,
        "soil_moisture_pct": 38.0,
        "uv_index": 5.0,
        "conditions": "Clear Skies",
        "is_real_data": False
    }

class WeatherService:
    """Wrapper class providing seamless access to Open-Meteo satellite weather."""
    def __init__(self):
        pass

    def get_weather(self, location_name: Optional[str] = "Nashik") -> Dict[str, Any]:
        loc = geocode_location(location_name or "Nashik")
        return fetch_live_agri_weather(loc["lat"], loc["lon"], loc["name"])
