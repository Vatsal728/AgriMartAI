"""
AgriMartAI - Real-Time Satellite Weather & Agrometeorological Service
Powered by Open-Meteo & FAO-56 Penman-Monteith Equations
Fetches:
- Real-Time Temperature, Humidity, Wind Speed, UV Index, Vapour Pressure Deficit (VPD)
- Multi-Layer Satellite Soil Moisture (0-1cm, 1-3cm, 3-9cm, 9-27cm)
- FAO-56 Reference Evapotranspiration (ET0)
- 48-Hour Ensemble Rain Probability & Precipitation Sum
"""

import requests
from typing import Dict, Any, Optional

# Indian agricultural regions fallback coordinates & instant cache
GEOCODE_CACHE = {
    "nashik": {"lat": 19.9975, "lon": 73.7898, "state": "Maharashtra", "crop_hub": "Grape/Onion Capital"},
    "pune": {"lat": 18.5204, "lon": 73.8567, "state": "Maharashtra", "crop_hub": "Sugarcane/Vegetables"},
    "mumbai": {"lat": 19.0760, "lon": 72.8777, "state": "Maharashtra", "crop_hub": "Coastal Agriculture"},
    "nagpur": {"lat": 21.1458, "lon": 79.0882, "state": "Maharashtra", "crop_hub": "Orange City"},
    "aurangabad": {"lat": 19.8762, "lon": 75.3433, "state": "Maharashtra", "crop_hub": "Cotton/Bajra"},
    "kolhapur": {"lat": 16.7050, "lon": 74.2433, "state": "Maharashtra", "crop_hub": "Sugarcane Belt"},
    "solapur": {"lat": 17.6599, "lon": 75.9064, "state": "Maharashtra", "crop_hub": "Pomegranate/Jowar"},
    "ludhiana": {"lat": 30.9010, "lon": 75.8573, "state": "Punjab", "crop_hub": "Wheat/Rice Belt"},
    "amritsar": {"lat": 31.6340, "lon": 74.8723, "state": "Punjab", "crop_hub": "Wheat/Basmati Rice"},
    "jalandhar": {"lat": 31.3260, "lon": 75.5762, "state": "Punjab", "crop_hub": "Potato/Maize Hub"},
    "karnal": {"lat": 29.6857, "lon": 76.9905, "state": "Haryana", "crop_hub": "Basmati Rice/Wheat Hub"},
    "hisar": {"lat": 29.1492, "lon": 75.7217, "state": "Haryana", "crop_hub": "Cotton/Mustard"},
    "surat": {"lat": 21.1702, "lon": 72.8311, "state": "Gujarat", "crop_hub": "Sugarcane/Vegetables"},
    "ahmedabad": {"lat": 23.0225, "lon": 72.5714, "state": "Gujarat", "crop_hub": "Cotton/Wheat/Castor"},
    "anand": {"lat": 22.5645, "lon": 72.9289, "state": "Gujarat", "crop_hub": "Tobacco/Dairy/Banana"},
    "rajkot": {"lat": 22.3039, "lon": 70.8022, "state": "Gujarat", "crop_hub": "Groundnut/Cotton Belt"},
    "vadodara": {"lat": 22.3072, "lon": 73.1812, "state": "Gujarat", "crop_hub": "Tobacco/Cotton/Paddy"},
    "bhavnagar": {"lat": 21.7645, "lon": 72.1519, "state": "Gujarat", "crop_hub": "Onion/Groundnut"},
    "junagadh": {"lat": 21.5222, "lon": 70.4579, "state": "Gujarat", "crop_hub": "Kesar Mango/Groundnut"},
    "guntur": {"lat": 16.3067, "lon": 80.4365, "state": "Andhra Pradesh", "crop_hub": "Chilli/Cotton Capital"},
    "vijayawada": {"lat": 16.5062, "lon": 80.6480, "state": "Andhra Pradesh", "crop_hub": "Paddy/Mango Belt"},
    "visakhapatnam": {"lat": 17.6868, "lon": 83.2185, "state": "Andhra Pradesh", "crop_hub": "Sugarcane/Cashew"},
    "shimla": {"lat": 31.1048, "lon": 77.1734, "state": "Himachal Pradesh", "crop_hub": "Apple Bowl of India"},
    "bhopal": {"lat": 23.2599, "lon": 77.4126, "state": "Madhya Pradesh", "crop_hub": "Soybean/Pulses Hub"},
    "indore": {"lat": 22.7196, "lon": 75.8577, "state": "Madhya Pradesh", "crop_hub": "Soybean/Wheat Capital"},
    "ujjain": {"lat": 23.1765, "lon": 75.7885, "state": "Madhya Pradesh", "crop_hub": "Soybean/Gram"},
    "varanasi": {"lat": 25.3176, "lon": 82.9739, "state": "Uttar Pradesh", "crop_hub": "Paddy/Wheat Belt"},
    "lucknow": {"lat": 26.8467, "lon": 80.9462, "state": "Uttar Pradesh", "crop_hub": "Dasheri Mango/Sugarcane"},
    "kanpur": {"lat": 26.4499, "lon": 80.3319, "state": "Uttar Pradesh", "crop_hub": "Wheat/Mustard/Pulses"},
    "meerut": {"lat": 28.9845, "lon": 77.7064, "state": "Uttar Pradesh", "crop_hub": "Sugarcane Capital"},
    "delhi": {"lat": 28.6139, "lon": 77.2090, "state": "Delhi NCR", "crop_hub": "Agri Trading Hub"},
    "jaipur": {"lat": 26.9124, "lon": 75.7873, "state": "Rajasthan", "crop_hub": "Mustard/Bajra Hub"},
    "kota": {"lat": 25.2138, "lon": 75.8648, "state": "Rajasthan", "crop_hub": "Soybean/Coriander Capital"},
    "jodhpur": {"lat": 26.2389, "lon": 73.0243, "state": "Rajasthan", "crop_hub": "Guar/Cumin/Moong"},
    "bengaluru": {"lat": 12.9716, "lon": 77.5946, "state": "Karnataka", "crop_hub": "Horticulture/Vegetables"},
    "mysore": {"lat": 12.2958, "lon": 76.6394, "state": "Karnataka", "crop_hub": "Silk/Sugarcane/Paddy"},
    "hyderabad": {"lat": 17.3850, "lon": 78.4867, "state": "Telangana", "crop_hub": "Cotton/Chilli/Rice"},
    "chennai": {"lat": 13.0827, "lon": 80.2707, "state": "Tamil Nadu", "crop_hub": "Paddy/Coconut"},
    "coimbatore": {"lat": 11.0168, "lon": 76.9558, "state": "Tamil Nadu", "crop_hub": "Cotton/Poultry/Coconut"},
    "madurai": {"lat": 9.9252, "lon": 78.1198, "state": "Tamil Nadu", "crop_hub": "Jasmine/Paddy/Pulses"},
    "kolkata": {"lat": 22.5726, "lon": 88.3639, "state": "West Bengal", "crop_hub": "Jute/Paddy Delta"},
    "patna": {"lat": 25.5941, "lon": 85.1376, "state": "Bihar", "crop_hub": "Maize/Paddy/Litchi"},
    "raipur": {"lat": 21.2514, "lon": 81.6296, "state": "Chhattisgarh", "crop_hub": "Rice Bowl of India"}
}

WMO_WEATHER_CODES = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow Fall",
    73: "Moderate Snow Fall",
    75: "Heavy Snow Fall",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail"
}

_CACHED_DEVICE_LOCATION = None

def detect_device_location() -> Dict[str, Any]:
    """Auto-detect user's current city and GPS coordinates using public IP geolocation (cached)."""
    global _CACHED_DEVICE_LOCATION
    if _CACHED_DEVICE_LOCATION is not None:
        return _CACHED_DEVICE_LOCATION
        
    try:
        resp = requests.get("http://ip-api.com/json/?fields=status,country,regionName,city,lat,lon", timeout=1.5)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == "success":
                city = data.get("city", "Ahmedabad")
                region = data.get("regionName", "Gujarat")
                country = data.get("country", "India")
                _CACHED_DEVICE_LOCATION = {
                    "name": f"{city}, {region}",
                    "city": city,
                    "region": region,
                    "country": country,
                    "lat": float(data.get("lat", 23.0225)),
                    "lon": float(data.get("lon", 72.5714)),
                    "detected_online": True
                }
                return _CACHED_DEVICE_LOCATION
    except Exception:
        pass
        
    _CACHED_DEVICE_LOCATION = {
        "name": "Ahmedabad, Gujarat",
        "city": "Ahmedabad",
        "region": "Gujarat",
        "country": "India",
        "lat": 23.0225,
        "lon": 72.5714,
        "detected_online": False
    }
    return _CACHED_DEVICE_LOCATION

def reverse_geocode_gps(lat: float, lon: float) -> Dict[str, Any]:
    """Reverse geocode high-precision GPS coordinates into district/state name."""
    try:
        url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage=en"
        resp = requests.get(url, timeout=2.0)
        if resp.status_code == 200:
            d = resp.json()
            locality = d.get("locality") or d.get("city") or d.get("principalSubdivision", "Farm Location")
            admin = d.get("principalSubdivision", "")
            country = d.get("countryName", "India")
            full_name = f"{locality}, {admin}".strip(", ")
            return {
                "name": full_name,
                "city": locality,
                "region": admin,
                "country": country,
                "lat": lat,
                "lon": lon,
                "is_gps": True
            }
    except Exception:
        pass
        
    return {
        "name": f"GPS ({round(lat, 4)}, {round(lon, 4)})",
        "city": "GPS Location",
        "region": "Agricultural Zone",
        "country": "India",
        "lat": lat,
        "lon": lon,
        "is_gps": True
    }


def geocode_location(location_name: str) -> Dict[str, Any]:
    """Geocode any city/district globally with instant local caching."""
    if not location_name or not location_name.strip():
        location_name = "Ahmedabad, Gujarat"
        
    loc_clean = location_name.strip().lower()
    
    # Check exact match
    if loc_clean in GEOCODE_CACHE:
        cached = GEOCODE_CACHE[loc_clean]
        return {
            "name": location_name.title(),
            "lat": cached["lat"],
            "lon": cached["lon"],
            "region": f"{cached['state']} ({cached['crop_hub']})"
        }
    
    # Check substring match (e.g. "Ahmedabad, Gujarat" matches "ahmedabad")
    for k, v in GEOCODE_CACHE.items():
        if k in loc_clean:
            return {
                "name": location_name.title(),
                "lat": v["lat"],
                "lon": v["lon"],
                "region": f"{v['state']} ({v['crop_hub']})"
            }
    
    # Live Geocoding lookup with instant caching
    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={requests.utils.quote(location_name)}&count=1&language=en&format=json"
        resp = requests.get(url, timeout=2.5)
        if resp.status_code == 200:
            data = resp.json()
            if "results" in data and len(data["results"]) > 0:
                top = data["results"][0]
                res_obj = {
                    "name": top.get("name", location_name.title()),
                    "lat": float(top.get("latitude")),
                    "lon": float(top.get("longitude")),
                    "region": f"{top.get('admin1', '')}, {top.get('country', '')}".strip(", ")
                }
                # Cache for subsequent instant calls
                GEOCODE_CACHE[loc_clean] = {
                    "lat": res_obj["lat"],
                    "lon": res_obj["lon"],
                    "state": top.get('admin1', 'India'),
                    "crop_hub": "Regional Agriculture"
                }
                return res_obj
    except Exception:
        pass
        
    return {
        "name": location_name.title() if location_name else "Field Location",
        "lat": 23.0225,
        "lon": 72.5714,
        "region": "India (Default Agricultural Zone)"
    }

import time
_LIVE_WEATHER_CACHE = {}

def fetch_live_agri_weather(lat: float, lon: float, location_name: str = "Field Location") -> Dict[str, Any]:
    """
    Fetch comprehensive atmospheric, soil, and FAO-56 Penman-Monteith Evapotranspiration data from Open-Meteo.
    Cached for 5 minutes to ensure instant response time.
    """
    global _LIVE_WEATHER_CACHE
    cache_key = f"{round(lat, 2)}_{round(lon, 2)}"
    now = time.time()
    
    if cache_key in _LIVE_WEATHER_CACHE:
        cached_time, cached_data = _LIVE_WEATHER_CACHE[cache_key]
        if now - cached_time < 300:  # 5 min TTL
            return cached_data
            
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}&"
        f"current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index&"
        f"hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,vapour_pressure_deficit,et0_fao_evapotranspiration,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm&"
        f"daily=et0_fao_evapotranspiration,precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,uv_index_max&"
        f"forecast_days=2&timezone=auto"
    )
    
    try:
        resp = requests.get(url, timeout=1.5)
        if resp.status_code == 200:
            raw = resp.json()
            curr = raw.get("current", {})
            hourly = raw.get("hourly", {})
            daily = raw.get("daily", {})
            
            temp = float(curr.get("temperature_2m", 28.0))
            humidity = float(curr.get("relative_humidity_2m", 60.0))
            wind_speed = float(curr.get("wind_speed_10m", 8.0))
            rain_mm = float(curr.get("rain", 0.0))
            uv_index = float(curr.get("uv_index", 5.0))
            wmo_code = int(curr.get("weather_code", 0))
            weather_desc = WMO_WEATHER_CODES.get(wmo_code, "Partly Cloudy")
            
            # Next 12h peak rain probability
            precip_prob_list = hourly.get("precipitation_probability", [0])[:12]
            rain_prob = max(precip_prob_list) if precip_prob_list else 0
            
            # FAO-56 Daily Evapotranspiration (ET0 in mm/day)
            daily_et0_list = daily.get("et0_fao_evapotranspiration", [4.2])
            daily_et0 = float(daily_et0_list[0]) if daily_et0_list else 4.2
            
            # Vapour Pressure Deficit (VPD in kPa)
            vpd_list = hourly.get("vapour_pressure_deficit", [1.2])
            vpd = float(vpd_list[0]) if vpd_list else 1.2
            
            # Multi-layer root zone soil moisture (0-27cm)
            s_0_1 = hourly.get("soil_moisture_0_to_1cm", [0.35])
            s_1_3 = hourly.get("soil_moisture_1_to_3cm", [0.35])
            s_3_9 = hourly.get("soil_moisture_3_to_9cm", [0.35])
            s_9_27 = hourly.get("soil_moisture_9_to_27cm", [0.35])
            
            top_soil = (s_0_1[0] + s_1_3[0] + s_3_9[0]) / 3.0 if s_0_1 and s_1_3 and s_3_9 else 0.35
            root_soil = (s_3_9[0] + s_9_27[0]) / 2.0 if s_3_9 and s_9_27 else 0.35
            
            soil_moisture_pct = round(top_soil * 100.0, 1)
            soil_moisture_pct = max(10.0, min(95.0, soil_moisture_pct))
            root_zone_moisture_pct = round(root_soil * 100.0, 1)

            result = {
                "source": "Open-Meteo Satellite & FAO-56 Models (Live)",
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
                "root_zone_moisture_pct": root_zone_moisture_pct,
                "et0_fao_evapotranspiration_mm_day": daily_et0,
                "vapour_pressure_deficit_kpa": vpd,
                "uv_index": uv_index,
                "weather_code": wmo_code,
                "conditions": weather_desc,
                "is_real_data": True
            }
            _LIVE_WEATHER_CACHE[cache_key] = (now, result)
            return result
    except Exception as e:
        print(f"[WeatherService] Live API fetch exception: {e}")

    # Fallback to standard agrometeorology baseline
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
        "root_zone_moisture_pct": 42.0,
        "et0_fao_evapotranspiration_mm_day": 4.5,
        "vapour_pressure_deficit_kpa": 1.2,
        "uv_index": 5.0,
        "weather_code": 1,
        "conditions": "Mainly Clear",
        "is_real_data": False
    }

class WeatherService:
    def __init__(self):
        pass

    def get_weather(self, location_name: Optional[str] = "Nashik") -> Dict[str, Any]:
        loc = geocode_location(location_name or "Nashik")
        return fetch_live_agri_weather(loc["lat"], loc["lon"], loc["name"])
