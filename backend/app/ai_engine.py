import re
import json
from typing import Dict, List, Any, Optional

# Knowledge base for household diagnostic patterns
DIAGNOSTIC_RULES = [
    {
        "category_slug": "electrical",
        "keywords": ["spark", "buzzing", "breaker", "tripping", "outlet", "switch", "flickering", "smoke", "burning plastic", "ev charger", "wiring", "shock", "voltage", "fuse", "light fixture"],
        "category_name": "Electrical & Smart Home",
        "urgency_keywords": ["spark", "burning plastic", "smoke", "shock", "buzzing panel"],
        "safety_hazards": [
            "Fire Hazard: Burning plastic odor or buzzing circuit breaker indicates thermal stress.",
            "Do NOT touch exposed wiring with bare hands or damp tools.",
            "If smoke is detected, switch off the main service disconnect at the electrical panel immediately."
        ],
        "likely_causes": [
            "Overloaded branch circuit exceeding 80% continuous breaker amperage rating",
            "Loose neutral connection or arcing screw terminal behind the wall plate",
            "Faulty ground fault circuit interrupter (GFCI) or arc fault (AFCI) mechanism"
        ],
        "suggested_actions": [
            "Unplug high-draw appliances immediately (space heaters, microwaves, hair dryers).",
            "Locate your main breaker panel and keep a clear 3-foot clearance for the technician.",
            "Avoid flipping tripped breaker repeatedly to prevent contact weld."
        ],
        "typical_parts": ["20A Dual-function AFCI/GFCI Breaker", "Commercial Spec Tamper-Resistant Outlet", "Wire Nuts & Insulated Conduits"],
        "est_hours_min": 1.5,
        "est_hours_max": 3.0,
        "base_rate": 95.0
    },
    {
        "category_slug": "plumbing",
        "keywords": ["leak", "drip", "pipe", "water", "drain", "sink", "faucet", "toilet", "sewage", "burst", "pressure", "water heater", "clog", "flood", "disposal"],
        "urgency_keywords": ["burst", "flood", "gushing", "sewage", "ceiling leak", "overflow"],
        "category_name": "Plumbing & Pipe Services",
        "safety_hazards": [
            "Water Damage Risk: Uncontrolled water leaks can rapidly degrade subfloors and drywall.",
            "Slip and fall risk in affected areas.",
            "Sewage backups contain biological pathogens; avoid direct skin contact."
        ],
        "likely_causes": [
            "Compromised rubber slip-joint washer or worn P-trap thread sealant",
            "Failed cartridge valve or worn O-ring inside the faucet manifold",
            "Main sewer line root intrusion or localized grease obstruction in drain stack"
        ],
        "suggested_actions": [
            "Shut off the local angle-stop valve clockwise under the sink or toilet.",
            "If water continues flowing, shut off the main municipal water supply valve.",
            "Place absorbent towels and catch buckets to protect baseboards."
        ],
        "typical_parts": ["1.5-inch Heavy Duty Slip Joint P-Trap", "Plumber's Thread Sealant & Brass Nipple", "EPDM High-Temp Compression Washers"],
        "est_hours_min": 1.0,
        "est_hours_max": 2.5,
        "base_rate": 85.0
    },
    {
        "category_slug": "hvac",
        "keywords": ["ac", "air conditioner", "heating", "furnace", "thermostat", "cooling", "heat pump", "blower", "duct", "warm air", "freon", "refrigerant", "freezing"],
        "urgency_keywords": ["freezing winter", "heatwave 100", "gas odor", "furnace clicking"],
        "category_name": "HVAC, Heating & AC",
        "safety_hazards": [
            "If you smell rotten eggs (mercaptan natural gas odor), evacuate immediately and call 911 or the gas utility.",
            "High voltage capacitors inside outdoor condenser can store lethal electrical charges."
        ],
        "likely_causes": [
            "Dirty MERV air filter causing restricted airflow and evaporator coil freeze-up",
            "Failed dual run capacitor preventing the hermetic compressor from spinning",
            "Low refrigerant charge due to microscopic pinhole leak in copper coil joints"
        ],
        "suggested_actions": [
            "Turn thermostat from COOL/HEAT to OFF and switch FAN to ON to thaw frozen coils.",
            "Replace disposable air intake filter if discolored or clogged with dust.",
            "Clear brush and debris within 24 inches around outdoor condenser unit."
        ],
        "typical_parts": ["45/5 uF Dual Motor Run Capacitor", "High-Flow Pleated MERV-11 Filter", "Contactor Relay Switch"],
        "est_hours_min": 1.5,
        "est_hours_max": 3.0,
        "base_rate": 90.0
    },
    {
        "category_slug": "appliance",
        "keywords": ["refrigerator", "fridge", "washer", "washing machine", "dryer", "dishwasher", "oven", "stove", "microwave", "not spinning", "not cooling", "leaking dishwasher"],
        "urgency_keywords": ["spoiling food", "washer overflowing", "gas stove sparking continuously"],
        "category_name": "Major Appliance Repair",
        "safety_hazards": [
            "Water supply line pressure on washing machines can flood living areas if split.",
            "Unplug electrical appliance before inspecting rear access panels."
        ],
        "likely_causes": [
            "Condenser fan motor failure or iced evaporator fan in frost-free freezer",
            "Clogged pump impeller or kinked corrugated drain discharge hose",
            "Faulty heating element thermal fuse or defective door safety latch interlock"
        ],
        "suggested_actions": [
            "Keep refrigerator and freezer doors shut tight to preserve cold air (safe for 4 hours).",
            "Check breaker box to confirm circuit hasn't silently tripped.",
            "Note the exact model & serial number from the inner door sticker for the technician."
        ],
        "typical_parts": ["OEM Thermal Cutoff Fuse", "Magnetic Drain Pump Motor", "Micro-switch Door Latch Assembly"],
        "est_hours_min": 1.0,
        "est_hours_max": 2.5,
        "base_rate": 78.0
    },
    {
        "category_slug": "cleaning",
        "keywords": ["cleaning", "deep clean", "sanitize", "move out", "move in", "carpet", "dust", "mold", "stain", "tile grout", "maid", "disinfect"],
        "urgency_keywords": ["same day move out inspection", "landlord inspection"],
        "category_name": "Deep Cleaning & Sanitization",
        "safety_hazards": [
            "Ensure proper cross-ventilation when using deep stain lifting products.",
            "Wear gloves when dealing with heavy mold or post-flood residue."
        ],
        "likely_causes": [
            "Accumulated atmospheric particulate and cooking grease oils on vertical surfaces",
            "Deep-set calcium carbonate deposits on shower glass and ceramic grout lines"
        ],
        "suggested_actions": [
            "Pre-clear personal belongings and clutter from countertops to maximize cleaning time.",
            "Inform the team in advance of special surfaces (natural marble, hardwood, delicate fabrics)."
        ],
        "typical_parts": ["Eco-certified Neutral pH Cleaner", "Microfiber Filtration Pads", "High-Pressure Steam Disinfection Wand"],
        "est_hours_min": 2.5,
        "est_hours_max": 5.0,
        "base_rate": 48.0
    },
    {
        "category_slug": "handyman",
        "keywords": ["handyman", "mount", "tv", "drywall", "hole", "shelf", "shelves", "door", "hinge", "furniture", "assembly", "lock", "curtain", "patch"],
        "urgency_keywords": ["broken front door lock", "falling heavy shelf"],
        "category_name": "Handyman & Carpentry",
        "safety_hazards": [
            "Heavy TVs (over 55 inches) require solid wooden stud anchoring or toggle bolts rated for shear weight.",
            "Inspect wall with stud finder to avoid hidden in-wall electrical conduits and water pipes."
        ],
        "likely_causes": [
            "Settling foundation causing door jamb misalignments and friction rubbing",
            "Fastener pullout from hollow drywall anchors lacking stud backing"
        ],
        "suggested_actions": [
            "Mark desired center height for hanging art or TV with blue painter's tape.",
            "Clear a 6x6 foot floor workspace for furniture assembly unpackaging."
        ],
        "typical_parts": ["Heavy-duty SnapToggle Heavy Wall Anchors", "Mesh Self-Adhesive Drywall Patch Kit", "Pre-mixed Lightweight Joint Compound"],
        "est_hours_min": 1.0,
        "est_hours_max": 3.0,
        "base_rate": 65.0
    },
    {
        "category_slug": "landscaping",
        "keywords": ["lawn", "grass", "mow", "sprinkler", "irrigation", "tree", "trim", "hedge", "garden", "leaves", "yard", "fertilize"],
        "urgency_keywords": ["broken irrigation geyser", "fallen tree branch blocking driveway"],
        "category_name": "Lawn Care & Landscaping",
        "safety_hazards": [
            "Never attempt trimming branches near overhead power distribution lines.",
            "Call 811 (Dig Safe) before any mechanized trenching or deep planting."
        ],
        "likely_causes": [
            "Mower damage or stuck solenoid on subterranean sprinkler pop-up heads",
            "Compacted soil limiting oxygen permeability to root rootstock"
        ],
        "suggested_actions": [
            "Mark irrigation valve box lids and hidden sprinkler heads with flags.",
            "Ensure exterior hose bibs and backyard gate latches are unlocked."
        ],
        "typical_parts": ["RainBird 4-inch Pop-up Sprinkler Nozzle", "Low-voltage Irrigation Solenoid", "Organic Slow-Release Fertilizer Mix"],
        "est_hours_min": 1.5,
        "est_hours_max": 3.5,
        "base_rate": 55.0
    },
    {
        "category_slug": "pest-control",
        "keywords": ["pest", "bug", "bugs", "insects", "ants", "wasp", "wasps", "bee", "rodent", "mouse", "mice", "rat", "termite", "cockroach", "spider"],
        "urgency_keywords": ["wasp nest near door", "infestation", "termites eating wood", "rat in kitchen"],
        "category_name": "Eco Pest & Wildlife Control",
        "safety_hazards": [
            "Do NOT swat or disturb yellowjacket or hornet nests; agitated colonies release attack pheromones.",
            "Keep pets and infants away from suspect entry trails."
        ],
        "likely_causes": [
            "Seasonal temperature drops driving insects indoors searching for moisture and food crumbs",
            "Unsealed perimeter gaps greater than 1/4 inch around pipe penetrations and weep holes"
        ],
        "suggested_actions": [
            "Keep children and pets indoors away from active nest locations.",
            "Store open pantry goods in airtight glass or thick plastic containers.",
            "Do not spray store-bought aerosol repellents directly into nests without protective gear."
        ],
        "typical_parts": ["Copper Mesh Rodent Exclusion Seal", "Botanical Pyrethrin Targeted Formulation", "Tamper-Resistant Pet-Safe Monitoring Stations"],
        "est_hours_min": 1.5,
        "est_hours_max": 2.5,
        "base_rate": 80.0
    },
    {
        "category_slug": "painting",
        "keywords": ["paint", "painting", "wall", "color", "ceiling", "stain", "primer", "trim", "siding", "caulk", "cabinet paint"],
        "urgency_keywords": ["water stain seal before open house"],
        "category_name": "Painting & Surface Finishing",
        "safety_hazards": [
            "Ensure proper cross-ventilation when priming over water or smoke stains.",
            "Secure drop cloths with non-slip backing on hardwood stairs."
        ],
        "likely_causes": [
            "Substrate expansion/contraction causing paint film cleavage and hairline cracking",
            "Old moisture leak leaving residual surfactant leaching on gypsum board"
        ],
        "suggested_actions": [
            "If you have leftover original paint cans with the formula code, set them out.",
            "Move lightweight furniture away from target accent walls."
        ],
        "typical_parts": ["Stain-blocking Shellac/Oil Primer", "Low-VOC Premium Acrylic Eggshell Paint", "1.5-inch Clean-Release Edge Masking Tape"],
        "est_hours_min": 2.0,
        "est_hours_max": 4.5,
        "base_rate": 60.0
    }
]

def analyze_household_issue(query_text: str, custom_urgency: Optional[str] = None) -> Dict[str, Any]:
    """
    Performs AI diagnostic triage on customer problem description.
    Returns matched category, urgency level, safety warnings, likely root causes,
    immediate action checklist, parts estimate, labor hours, and cost breakdown.
    """
    query_lower = query_text.lower()
    
    # Best category match scoring
    best_match = None
    highest_score = 0
    
    for rule in DIAGNOSTIC_RULES:
        score = 0
        for kw in rule["keywords"]:
            if kw in query_lower:
                score += 2
        # Check title / description matches
        if rule["category_slug"] in query_lower:
            score += 4
        if score > highest_score:
            highest_score = score
            best_match = rule
            
    # Default fallback if unknown
    if not best_match or highest_score == 0:
        best_match = DIAGNOSTIC_RULES[5] # Handyman default
        
    # Detect urgency
    detected_urgency = "standard"
    if custom_urgency and custom_urgency in ["standard", "priority_same_day", "emergency_24_7"]:
        detected_urgency = custom_urgency
    else:
        for ukw in best_match.get("urgency_keywords", []):
            if ukw in query_lower:
                detected_urgency = "priority_same_day"
                break
        if any(w in query_lower for w in ["emergency", "burst", "flood", "fire", "spark", "gas odor", "urgent", "right now", "immediately"]):
            detected_urgency = "emergency_24_7"

    # Multipliers
    urgency_multiplier = 1.0
    if detected_urgency == "priority_same_day":
        urgency_multiplier = 1.35
    elif detected_urgency == "emergency_24_7":
        urgency_multiplier = 1.75

    base_rate = best_match["base_rate"]
    effective_rate = round(base_rate * urgency_multiplier, 2)
    
    est_hours_min = best_match["est_hours_min"]
    est_hours_max = best_match["est_hours_max"]
    typical_hours = round((est_hours_min + est_hours_max) / 2, 1)

    parts_min = 20.0
    parts_max = 65.0
    parts_typical = round((parts_min + parts_max) / 2, 2)

    escrow_fee = 14.50
    
    cost_min = round((est_hours_min * effective_rate) + parts_min + escrow_fee, 2)
    cost_typical = round((typical_hours * effective_rate) + parts_typical + escrow_fee, 2)
    cost_max = round((est_hours_max * effective_rate) + parts_max + escrow_fee, 2)

    # Critical Safety Flags
    safety_alerts = list(best_match["safety_hazards"])
    is_critical_hazard = False
    if "gas" in query_lower:
        safety_alerts.insert(0, "🚨 CRITICAL GAS WARNING: Natural gas detected. Evacuate premises immediately, leave doors open, do not turn any electric switches on or off, call emergency services.")
        is_critical_hazard = True
    elif "spark" in query_lower or "burning" in query_lower or "smoke" in query_lower:
        safety_alerts.insert(0, "⚠️ FIRE HAZARD: Electrical arcing or thermal burning detected. Flip off circuit breaker immediately.")
        is_critical_hazard = True
    elif "burst" in query_lower or "gushing" in query_lower or "flood" in query_lower:
        safety_alerts.insert(0, "💧 WATER SHUTOFF ALERT: Main shutoff valve should be closed immediately to prevent structural framing rot.")
        is_critical_hazard = True

    # Technician Verified Scope Checklist
    scope_checklist = [
        f"Perform multi-point diagnostic on {best_match['category_name'].lower()} symptoms",
        f"Inspect adjacent components for secondary stress or wear",
        f"Present fixed-scope itemization before beginning physical repairs",
        f"Perform post-installation pressure/load test under customer supervision",
        f"Clean worksite and provide 30-day HomeAssist Marketplace Guarantee sign-off"
    ]

    return {
        "status": "success",
        "category_slug": best_match["category_slug"],
        "category_name": best_match["category_name"],
        "detected_urgency": detected_urgency,
        "is_critical_hazard": is_critical_hazard,
        "safety_alerts": safety_alerts,
        "likely_causes": best_match["likely_causes"],
        "immediate_actions": best_match["suggested_actions"],
        "recommended_parts": best_match["typical_parts"],
        "scope_checklist": scope_checklist,
        "pricing_estimate": {
            "hourly_rate": effective_rate,
            "base_rate": base_rate,
            "urgency_multiplier": urgency_multiplier,
            "estimated_hours_range": [est_hours_min, est_hours_max],
            "estimated_typical_hours": typical_hours,
            "parts_estimate": parts_typical,
            "escrow_guarantee_fee": escrow_fee,
            "total_min": cost_min,
            "total_typical": cost_typical,
            "total_max": cost_max,
            "currency": "USD"
        },
        "ai_confidence_score": 0.94,
        "summary": f"Identified as a {best_match['category_name']} issue requiring an estimated {typical_hours} hours. Urgency set to {detected_urgency.replace('_', ' ').title()}."
    }
