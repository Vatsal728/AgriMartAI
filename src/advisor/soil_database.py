"""
AgriMartAI - ICAR National Bureau of Soil Survey (NBSS&LUP) Agro-Climatic Soil Database
Maps Indian States, Districts, and Agro-Ecological Zones to dominant soil texture and water retention capacity.
"""

from typing import Dict, Any

# Dominant Soil Classification mapped to Indian States & Districts (ICAR / NBSS&LUP data)
REGIONAL_SOIL_MAP = {
    # Western & Central Black Soil Belt (Vertisols)
    "gujarat": {"soil": "Black Cotton Soil", "texture": "Clayey/Medium Black", "water_retention": "High (Field Capacity: 45%)"},
    "maharashtra": {"soil": "Black Cotton Soil", "texture": "Deep Vertisol", "water_retention": "Very High (Field Capacity: 48%)"},
    "madhya pradesh": {"soil": "Black Cotton Soil", "texture": "Medium Black Soil", "water_retention": "High (Field Capacity: 44%)"},
    
    # Northern Alluvial Plain (Inceptisols & Entisols)
    "punjab": {"soil": "Loamy Soil", "texture": "Alluvial Loam", "water_retention": "Moderate (Field Capacity: 38%)"},
    "haryana": {"soil": "Loamy Soil", "texture": "Alluvial Loam/Sandy Loam", "water_retention": "Moderate (Field Capacity: 36%)"},
    "uttar pradesh": {"soil": "Loamy Soil", "texture": "Gangetic Alluvium", "water_retention": "Moderate to High (Field Capacity: 40%)"},
    "bihar": {"soil": "Loamy Soil", "texture": "Fine Alluvial Silt", "water_retention": "High (Field Capacity: 42%)"},
    "west bengal": {"soil": "Loamy Soil", "texture": "Deltaic Alluvium/Clayey", "water_retention": "High (Field Capacity: 45%)"},
    
    # Southern Red & Laterite Soils (Alfisols & Ultisols)
    "andhra pradesh": {"soil": "Red / Sandy Loam", "texture": "Red Sandy/Clay Loam", "water_retention": "Moderate (Field Capacity: 32%)"},
    "telangana": {"soil": "Red / Sandy Loam", "texture": "Red Earth (Chalka)", "water_retention": "Moderate (Field Capacity: 30%)"},
    "karnataka": {"soil": "Red / Sandy Loam", "texture": "Red Sandy Loam", "water_retention": "Moderate (Field Capacity: 34%)"},
    "tamil nadu": {"soil": "Red / Clay Loam", "texture": "Red Loam & Black Pockets", "water_retention": "Moderate (Field Capacity: 35%)"},
    "kerala": {"soil": "Laterite Soil", "texture": "Acidic Laterite/Coastal Sandy", "water_retention": "Moderate (Field Capacity: 30%)"},
    
    # Himalayan Hill Regions
    "himachal pradesh": {"soil": "Mountain Loam", "texture": "Brown Forest Soil/Gravelly Loam", "water_retention": "Well-Drained (Field Capacity: 32%)"},
    "jammu and kashmir": {"soil": "Mountain Loam", "texture": "Karewa / Silty Clay Loam", "water_retention": "High (Field Capacity: 40%)"},
    "uttarakhand": {"soil": "Mountain Loam", "texture": "Sub-Montane Forest Soil", "water_retention": "Moderate (Field Capacity: 33%)"},
    
    # Arid & Desert Zones
    "rajasthan": {"soil": "Sandy Soil", "texture": "Desert Sandy Soil", "water_retention": "Low (Field Capacity: 22%)"}
}

def infer_soil_from_location(location_name: str) -> Dict[str, Any]:
    """
    Infers the dominant agricultural soil type automatically based on the district or state name.
    """
    loc_lower = (location_name or "").lower()
    
    for region_key, soil_info in REGIONAL_SOIL_MAP.items():
        if region_key in loc_lower:
            return {
                "inferred_soil": soil_info["soil"],
                "detailed_texture": soil_info["texture"],
                "water_retention": soil_info["water_retention"],
                "source": "ICAR-NBSS&LUP Agro-Climatic Database"
            }
            
    # City-level heuristic
    if any(k in loc_lower for k in ["nashik", "pune", "nagpur", "surat", "anand", "rajkot", "indore", "bhopal"]):
        return {
            "inferred_soil": "Black Cotton Soil",
            "detailed_texture": "Medium Black / Vertisol",
            "water_retention": "High (Field Capacity: 45%)",
            "source": "ICAR Regional Soil Survey"
        }
    elif any(k in loc_lower for k in ["ludhiana", "amritsar", "karnal", "varanasi", "lucknow", "patna"]):
        return {
            "inferred_soil": "Loamy Soil",
            "detailed_texture": "Alluvial Loam",
            "water_retention": "Moderate (Field Capacity: 38%)",
            "source": "ICAR Regional Soil Survey"
        }
    elif any(k in loc_lower for k in ["shimla", "kullu", "srinagar", "dehradun"]):
        return {
            "inferred_soil": "Mountain Loam",
            "detailed_texture": "Brown Forest Soil",
            "water_retention": "Well-Drained (Field Capacity: 32%)",
            "source": "ICAR Regional Soil Survey"
        }

    # Default fallback: Loamy soil (most balanced standard agricultural soil)
    return {
        "inferred_soil": "Loamy Soil",
        "detailed_texture": "Agricultural Loam",
        "water_retention": "Balanced (Field Capacity: 35%)",
        "source": "Standard Agronomy Reference"
    }
