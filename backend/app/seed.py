import json
import datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import User, Category, ProfessionalProfile, Booking, Review, BookingMessage

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Category).first():
        return

    print("Seeding HomeAssist Marketplace database with realistic, verified test data...")

    # 1. Categories
    categories_data = [
        {
            "slug": "plumbing",
            "name": "Plumbing & Pipe Services",
            "icon": "Droplets",
            "description": "Pipe leak repair, drain clearing, fixture installation, water heater diagnostics & emergency water shutoff.",
            "base_hourly_rate": 85.0,
            "urgency_multiplier": 1.6,
            "popular_tasks": json.dumps(["Burst Pipe Emergency", "Under-sink Leak Fix", "Water Heater Flush", "Clogged Main Drain", "Garbage Disposal Fix"])
        },
        {
            "slug": "electrical",
            "name": "Electrical & Smart Home",
            "icon": "Zap",
            "description": "Licensed circuit breaker maintenance, outlet replacement, EV charger installation, rewiring & lighting fixtures.",
            "base_hourly_rate": 95.0,
            "urgency_multiplier": 1.7,
            "popular_tasks": json.dumps(["Tripping Breaker Diagnostic", "EV Charger Install", "Smart Thermostat Setup", "Recessed Ceiling Lights", "GFCI Outlet Replacement"])
        },
        {
            "slug": "hvac",
            "name": "HVAC, Heating & AC",
            "icon": "Wind",
            "description": "Air conditioning tune-up, furnace heating repair, duct sanitization, refrigerant recharge & air quality filters.",
            "base_hourly_rate": 90.0,
            "urgency_multiplier": 1.5,
            "popular_tasks": json.dumps(["AC Blowing Warm Air", "Furnace Ignition Repair", "Seasonal HVAC Maintenance", "Blower Motor Noise", "Ductwork Leak Sealing"])
        },
        {
            "slug": "cleaning",
            "name": "Deep Cleaning & Sanitization",
            "icon": "Sparkles",
            "description": "Move-in/move-out deep sanitization, eco-friendly surface disinfection, carpet steam extraction & post-construction clean.",
            "base_hourly_rate": 48.0,
            "urgency_multiplier": 1.3,
            "popular_tasks": json.dumps(["Move-out Deep Clean", "Oven & Fridge Interior Clean", "Carpet Steam Wash", "Whole-house Sanitization", "Window Detailing"])
        },
        {
            "slug": "handyman",
            "name": "Handyman & Carpentry",
            "icon": "Hammer",
            "description": "Drywall patching, door & hinge alignment, custom floating shelves, TV mounting & flatpack furniture assembly.",
            "base_hourly_rate": 65.0,
            "urgency_multiplier": 1.3,
            "popular_tasks": json.dumps(["TV Wall Mounting (up to 85\")", "Drywall Hole Patching", "IKEA / Wayfair Assembly", "Sliding Door Track Repair", "Deck Board Replacement"])
        },
        {
            "slug": "appliance",
            "name": "Major Appliance Repair",
            "icon": "Cpu",
            "description": "Refrigerator cooling failure, washer spin cycle fault, dishwasher drainage error & induction cooktop repair.",
            "base_hourly_rate": 78.0,
            "urgency_multiplier": 1.4,
            "popular_tasks": json.dumps(["Refrigerator Not Cooling", "Washing Machine Won't Drain", "Dishwasher Error Code E24", "Dryer Heating Element", "Range Burner Sparking"])
        },
        {
            "slug": "landscaping",
            "name": "Lawn Care & Landscaping",
            "icon": "Trees",
            "description": "Precision lawn mowing, hedge trimming, sprinkler system maintenance, yard aeration & seasonal leaf cleanup.",
            "base_hourly_rate": 55.0,
            "urgency_multiplier": 1.2,
            "popular_tasks": json.dumps(["Sprinkler Zone Head Fix", "Hedge & Shrub Sculpting", "Yard Debris Removal", "Aeration & Overseeding", "Sod Turf Patching"])
        },
        {
            "slug": "painting",
            "name": "Painting & Surface Finishing",
            "icon": "Paintbrush",
            "description": "Interior accent walls, ceiling painting, exterior siding touchup, cabinet refinishing & waterproof caulking.",
            "base_hourly_rate": 60.0,
            "urgency_multiplier": 1.2,
            "popular_tasks": json.dumps(["Living Room Accent Wall", "Kitchen Cabinet Paint", "Ceiling Water Stain Cover", "Baseboard & Trim Paint", "Caulking & Grout Seal"])
        },
        {
            "slug": "pest-control",
            "name": "Eco Pest & Wildlife Control",
            "icon": "ShieldCheck",
            "description": "Child- & pet-safe preventative treatments, termite inspection, rodent entry sealing & wasp nest safe extraction.",
            "base_hourly_rate": 80.0,
            "urgency_multiplier": 1.5,
            "popular_tasks": json.dumps(["Eco Wasp Nest Removal", "Attic Rodent Proofing", "Termite Barrier Inspection", "Quarterly Perimeter Shield", "Ant Colony Eradication"])
        }
    ]

    cat_models = {}
    for c_data in categories_data:
        cat = Category(**c_data)
        db.add(cat)
        db.flush()
        cat_models[cat.slug] = cat

    # 2. Users (Strictly synthetic names, dummy credentials)
    # Demo Customer
    demo_customer = User(
        email="customer.demo@homeassist-demo.local",
        full_name="Jordan Blake",
        role="customer",
        phone_masked="+1 (555) 019-4822",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    )
    db.add(demo_customer)

    # Demo Admin
    demo_admin = User(
        email="admin.demo@homeassist-demo.local",
        full_name="Marketplace Trust Overseer",
        role="admin",
        phone_masked="+1 (555) 019-9000",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    )
    db.add(demo_admin)
    db.flush()

    # 3. Verified Professionals (Diverse, vetted, synthetic personas)
    pros_seed = [
        {
            "user_email": "marcus.vance@pro-demo.local",
            "full_name": "Marcus Vance",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            "business_name": "Vance Master Plumbing & Water Care",
            "tagline": "Master Licensed Plumber • 14 Years Experience • 24/7 Rapid Response",
            "bio": "Specialized in high-pressure leak detection, copper & PEX repiping, tankless water heater retrofits, and non-invasive drain clearing. Full state certification with 100% clean background verification.",
            "category_slug": "plumbing",
            "hourly_rate": 89.0,
            "rating": 4.97,
            "review_count": 86,
            "jobs_completed": 142,
            "years_experience": 14,
            "verification_status": "verified",
            "background_check_cleared": True,
            "insured_amount": "$2,000,000 Commercial General Liability",
            "license_number": "MPL-90482-STATE",
            "identity_verified": True,
            "skills": json.dumps(["Acoustic Leak Detection", "PEX & Copper Soldering", "Navien Tankless Certified", "Camera Sewer Scope", "Sump Pump Emergency"]),
            "badges": json.dumps(["Master Trade Licensed", "Background Checked", "$2M Insured", "Fast Responder (15 min)", "HomeAssist Elite Pro"]),
            "service_radius_miles": 30,
            "location_city": "Metro West & Downtown",
            "available_now": True,
            "emergency_capable": True
        },
        {
            "user_email": "elena.rostova@pro-demo.local",
            "full_name": "Elena Rostova",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
            "business_name": "VoltCraft Smart Electrical Solutions",
            "tagline": "Certified Master Electrician • Smart Home & EV Specialist",
            "bio": "Expert in electric vehicle Level 2 chargers, main panel 200A upgrades, whole-house surge suppression, and smart automation systems (Lutron, Nest, Ecobee). Safety-first protocol with meticulous code compliance.",
            "category_slug": "electrical",
            "hourly_rate": 96.0,
            "rating": 4.99,
            "review_count": 112,
            "jobs_completed": 184,
            "years_experience": 11,
            "verification_status": "verified",
            "background_check_cleared": True,
            "insured_amount": "$1,000,000 General Trade Insurance",
            "license_number": "ELEC-77192-MTR",
            "identity_verified": True,
            "skills": json.dumps(["Panel Upgrades (200A)", "Tesla & universal EVSE", "Smart Lighting Automation", "Ground Fault Diagnosis", "Thermal IR Inspections"]),
            "badges": json.dumps(["Licensed Master Electrician", "Background Checked", "EV Certified Specialist", "Top Rated 2026", "Zero-Accident Safety Award"]),
            "service_radius_miles": 25,
            "location_city": "North County & Central",
            "available_now": True,
            "emergency_capable": True
        },
        {
            "user_email": "sarah.jenkins@pro-demo.local",
            "full_name": "Sarah Jenkins",
            "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
            "business_name": "Jenkins Climate Control & Heat Pumps",
            "tagline": "EPA Certified HVAC Technician • Energy Efficiency Enthusiast",
            "bio": "Dedicated to quiet, energy-saving climate solutions. Carrier & Trane certified. Diagnostic accuracy guaranteed on AC freeze-ups, refrigerant imbalances, condenser coils, and high-SEER heat pumps.",
            "category_slug": "hvac",
            "hourly_rate": 92.0,
            "rating": 4.93,
            "review_count": 64,
            "jobs_completed": 98,
            "years_experience": 9,
            "verification_status": "verified",
            "background_check_cleared": True,
            "insured_amount": "$1,000,000 Liability Coverage",
            "license_number": "HVAC-44910-EPA",
            "identity_verified": True,
            "skills": json.dumps(["EPA Universal Section 608", "Heat Pump Diagnostics", "Capacitor & Contactor Swap", "Air Balancing", "HEPA Filtration"]),
            "badges": json.dumps(["EPA Universal Certified", "Background Checked", "Eco-Friendly Pro", "Guaranteed Workmanship"]),
            "service_radius_miles": 28,
            "location_city": "South Metro & Hills",
            "available_now": True,
            "emergency_capable": True
        },
        {
            "user_email": "carlos.mendez@pro-demo.local",
            "full_name": "Carlos Mendez",
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
            "business_name": "Precision Handyman & Craft Woodwork",
            "tagline": "General Carpentry, Drywall Perfection & Fixture Installation",
            "bio": "Multi-skilled craftsman tackling drywall holes without visible seams, structural TV mounts into metal/wood studs, door jamb alignment, and fine trim carpentry. I treat your home like a showroom.",
            "category_slug": "handyman",
            "hourly_rate": 68.0,
            "rating": 4.95,
            "review_count": 73,
            "jobs_completed": 120,
            "years_experience": 8,
            "verification_status": "verified",
            "background_check_cleared": True,
            "insured_amount": "$1,000,000 Handyman Liability",
            "license_number": "CONTR-55319-GEN",
            "identity_verified": True,
            "skills": json.dumps(["Invisible Drywall Blending", "Heavy Art & TV Mounting", "Weatherstripping & Locks", "Crown Molding", "Cabinet Hardware"]),
            "badges": json.dumps(["Bonded & Insured", "Background Checked", "Meticulous Finish", "5-Star Favorite"]),
            "service_radius_miles": 20,
            "location_city": "Eastside & Central",
            "available_now": True,
            "emergency_capable": False
        },
        {
            "user_email": "priya.sharma@pro-demo.local",
            "full_name": "Priya Sharma",
            "avatar": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80",
            "business_name": "PureLuxe Eco Deep Clean & Sanitization",
            "tagline": "Hospital-Grade Hygiene • 100% Non-Toxic & Pet Safe",
            "bio": "Leading a verified team using HEPA filtration vacuums, plant-based antimicrobial solutions, and deep steam extraction. Specialists in post-renovation dust removal and hypoallergenic deep sanitization.",
            "category_slug": "cleaning",
            "hourly_rate": 52.0,
            "rating": 4.98,
            "review_count": 139,
            "jobs_completed": 210,
            "years_experience": 6,
            "verification_status": "verified",
            "background_check_cleared": True,
            "insured_amount": "$1,000,000 Bonding & Insurance",
            "license_number": "CLN-BUS-12093",
            "identity_verified": True,
            "skills": json.dumps(["HEPA Deep Dusting", "Green Seal Certified Products", "Grout Steam Cleaning", "Allergen Sanitization", "Appliance Interior Polish"]),
            "badges": json.dumps(["Green Clean Certified", "Background Checked", "Fully Bonded", "Top Rated 2026", "Pet Friendly Pro"]),
            "service_radius_miles": 25,
            "location_city": "All Districts",
            "available_now": True,
            "emergency_capable": False
        },
        {
            "user_email": "liam.chen@pro-demo.local",
            "full_name": "Liam Chen",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
            "business_name": "Apex Appliance Diagnostics & Repair",
            "tagline": "Factory-Trained Tech • Samsung, LG, Bosch & Whirlpool Specialist",
            "bio": "Digital diagnostic scanning for smart refrigeration, silent washing machine drive motors, inverter compressors, and induction ranges. We carry top OEM parts on our service vehicles for same-day fixes.",
            "category_slug": "appliance",
            "hourly_rate": 82.0,
            "rating": 4.91,
            "review_count": 52,
            "jobs_completed": 88,
            "years_experience": 10,
            "verification_status": "verified",
            "background_check_cleared": True,
            "insured_amount": "$1,000,000 Equipment & Liability",
            "license_number": "APP-99320-TECH",
            "identity_verified": True,
            "skills": json.dumps(["Oscilloscope Board Diagnosis", "Inverter Compressor Replacement", "Water Valve Replacement", "Thermal Fuse Sourcing", "OEM Certified"]),
            "badges": json.dumps(["OEM Factory Trained", "Background Checked", "Insured & Bonded", "Fast Diagnostic"]),
            "service_radius_miles": 22,
            "location_city": "South & East Metro",
            "available_now": True,
            "emergency_capable": True
        },
        {
            "user_email": "chloe.bennett@pro-demo.local",
            "full_name": "Chloe Bennett",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
            "business_name": "Verdant Craft Landscaping & Irrigation",
            "tagline": "Smart Water Conservation • Horticultural Care & Lawn Sculpting",
            "bio": "Specialists in low-water smart drip irrigation, Rachio smart controller installation, organic turf care, and artistic shrub styling. Keep your home exterior gorgeous year-round with verified eco-practices.",
            "category_slug": "landscaping",
            "hourly_rate": 58.0,
            "rating": 4.92,
            "review_count": 45,
            "jobs_completed": 76,
            "years_experience": 7,
            "verification_status": "verified",
            "background_check_cleared": True,
            "insured_amount": "$1,000,000 Landscape Contractor Bond",
            "license_number": "LND-33012-IRR",
            "identity_verified": True,
            "skills": json.dumps(["Smart Rachio Irrigation Setup", "Backflow Preventer Testing", "Native Flora Planting", "Organic Aeration", "Precision Edging"]),
            "badges": json.dumps(["Smart Water Specialist", "Background Checked", "Insured & Bonded", "Seasonal Master"]),
            "service_radius_miles": 30,
            "location_city": "Valley & Suburbs",
            "available_now": True,
            "emergency_capable": False
        },
        {
            "user_email": "devon.reed@pro-demo.local",
            "full_name": "Devon Reed",
            "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
            "business_name": "ShieldSafe Eco Pest & Structural Defense",
            "tagline": "Targeted Organic Pest Exclusion & Structural Sealing",
            "bio": "Protecting homes with non-fumigation exclusion barriers, ultrasonic rodent repulsion, safe hornet extraction, and thermal wood inspection. Child, feline, and canine safe formulations always.",
            "category_slug": "pest-control",
            "hourly_rate": 84.0,
            "rating": 4.96,
            "review_count": 61,
            "jobs_completed": 95,
            "years_experience": 12,
            "verification_status": "verified",
            "background_check_cleared": True,
            "insured_amount": "$1,500,000 Pest & Environmental Shield",
            "license_number": "PEST-STRUCT-8841",
            "identity_verified": True,
            "skills": json.dumps(["Non-toxic Botanical Repellents", "Attic Entry Exclusion", "Thermal Termite Scanning", "Wasp Colony Removal", "Sanitation Audit"]),
            "badges": json.dumps(["State Certified Applicator", "Background Checked", "Eco-Friendly Formula", "$1.5M Insured", "Emergency Ready"]),
            "service_radius_miles": 35,
            "location_city": "Greater Metro Region",
            "available_now": True,
            "emergency_capable": True
        }
    ]

    pro_models = []
    for p in pros_seed:
        user = User(
            email=p["user_email"],
            full_name=p["full_name"],
            role="pro",
            avatar_url=p["avatar"]
        )
        db.add(user)
        db.flush()

        cat = cat_models[p["category_slug"]]
        profile = ProfessionalProfile(
            user_id=user.id,
            business_name=p["business_name"],
            tagline=p["tagline"],
            bio=p["bio"],
            category_id=cat.id,
            hourly_rate=p["hourly_rate"],
            rating=p["rating"],
            review_count=p["review_count"],
            jobs_completed=p["jobs_completed"],
            years_experience=p["years_experience"],
            verification_status=p["verification_status"],
            background_check_cleared=p["background_check_cleared"],
            insured_amount=p["insured_amount"],
            license_number=p["license_number"],
            identity_verified=p["identity_verified"],
            skills=p["skills"],
            badges=p["badges"],
            service_radius_miles=p["service_radius_miles"],
            location_city=p["location_city"],
            available_now=p["available_now"],
            emergency_capable=p["emergency_capable"],
            profile_image=p["avatar"]
        )
        db.add(profile)
        db.flush()
        pro_models.append(profile)

    # 4. Realistic Demo Bookings for the Demo Customer
    # Booking 1: Confirmed upcoming job with Marcus Vance (Plumbing)
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    tomorrow_str = (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

    b1 = Booking(
        booking_reference="BK-7049",
        customer_id=demo_customer.id,
        pro_id=pro_models[0].id, # Marcus Vance
        category_id=cat_models["plumbing"].id,
        title="Kitchen Sink Pipe Leak & Pressure Valve Inspection",
        problem_description="Persistent slow drip under the main kitchen sink drain pipe whenever water runs. Possible loose P-trap compression ring or corroded washer.",
        urgency="standard",
        scheduled_date=tomorrow_str,
        scheduled_time_slot="10:00 AM - 12:00 PM",
        service_address="742 Evergreen Terrace, Apt 4B, Springfield, NW",
        estimated_hours=1.5,
        hourly_rate=89.0,
        parts_estimate=25.0,
        escrow_fee=12.0,
        total_amount=170.50,
        status="confirmed",
        payment_status="escrow_held",
        payment_method="Mock Visa Card (ending in 4242)",
        escrow_transaction_id="ESC-99201-SIM",
        pro_notes="Will bring standard 1.5 inch slip-joint fittings, heavy-duty rubber gaskets, and pipe thread sealant."
    )
    db.add(b1)
    db.flush()

    # Add messages for Booking 1
    m1 = BookingMessage(
        booking_id=b1.id,
        sender_name="System Escrow Bot",
        sender_role="system",
        message_text="Payment of $170.50 has been securely placed into HomeAssist Escrow. The technician will only receive payout after you confirm satisfactory completion."
    )
    m2 = BookingMessage(
        booking_id=b1.id,
        sender_name="Marcus Vance",
        sender_role="pro",
        message_text="Hello Jordan! I have your booking on my schedule for tomorrow morning. I've prepared the necessary PVC and brass fixtures. Feel free to message here if you notice any changes in the leak."
    )
    db.add(m1)
    db.add(m2)

    # Booking 2: Active "pro_en_route" for Elena Rostova (Electrical)
    b2 = Booking(
        booking_reference="BK-8192",
        customer_id=demo_customer.id,
        pro_id=pro_models[1].id, # Elena Rostova
        category_id=cat_models["electrical"].id,
        title="Sub-panel Breaker Diagnostic & EV Ready Setup",
        problem_description="Breaker in garage trips intermittently when high load appliances are engaged. Need thermal scan and load distribution check.",
        urgency="priority_same_day",
        scheduled_date=today_str,
        scheduled_time_slot="02:00 PM - 04:00 PM",
        service_address="742 Evergreen Terrace, Apt 4B, Springfield, NW",
        estimated_hours=2.0,
        hourly_rate=96.0,
        parts_estimate=45.0,
        escrow_fee=18.0,
        total_amount=255.00,
        status="pro_en_route",
        payment_status="escrow_held",
        payment_method="Mock Apple Pay",
        escrow_transaction_id="ESC-88310-SIM",
        pro_notes="Thermal imager and Siemens/Square-D tandem breakers packed in service vehicle."
    )
    db.add(b2)
    db.flush()

    m3 = BookingMessage(
        booking_id=b2.id,
        sender_name="Elena Rostova",
        sender_role="pro",
        message_text="I am en route to your location with the circuit diagnostic gear! ETA approximately 18 minutes depending on downtown traffic."
    )
    db.add(m3)

    # Booking 3: Completed booking with Review for Sarah Jenkins (HVAC)
    past_date_str = (datetime.date.today() - datetime.timedelta(days=4)).strftime("%Y-%m-%d")
    b3 = Booking(
        booking_reference="BK-6281",
        customer_id=demo_customer.id,
        pro_id=pro_models[2].id, # Sarah Jenkins
        category_id=cat_models["hvac"].id,
        title="Annual Heat Pump Seasonal Tune-up & Coil Clean",
        problem_description="Preventative inspection before winter freeze. Clean outdoor coils, check refrigerant pressures, inspect thermostat wiring.",
        urgency="standard",
        scheduled_date=past_date_str,
        scheduled_time_slot="09:00 AM - 11:00 AM",
        service_address="742 Evergreen Terrace, Apt 4B, Springfield, NW",
        estimated_hours=2.0,
        hourly_rate=92.0,
        parts_estimate=30.0,
        escrow_fee=15.0,
        total_amount=229.00,
        status="completed",
        payment_status="released_to_pro",
        payment_method="Mock Visa Card (ending in 4242)",
        escrow_transaction_id="ESC-77104-REL",
        pro_notes="Complete service completed. Coil flushed, dual capacitor tested within 2% factory tolerance. Escrow funds successfully cleared.",
        completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
    )
    db.add(b3)
    db.flush()

    # Review for Booking 3
    r3 = Review(
        booking_id=b3.id,
        customer_id=demo_customer.id,
        pro_id=pro_models[2].id,
        rating=5.0,
        comment="Sarah was unbelievably punctual, professional, and courteous! She explained exactly how the heat pump inverter works and showed me the pressure readings before and after. Outstanding service!",
        sentiment_tag="Exceptional Punctuality & Clear Communication",
        ai_summary="Customer praised punctuality, clear technical explanation, and transparent diagnostic gauges."
    )
    db.add(r3)

    # Add more reviews for each pro so their ratings and reviews look genuine
    sample_reviews = [
        (pro_models[0].id, 5.0, "Marcus arrived in 20 minutes when my copper pipe burst! He shut down the main, soldered a new brass coupler, and tested the pressure. Total lifesaver.", "Emergency Hero & Fast Execution"),
        (pro_models[0].id, 4.9, "Cleaned up every drop of water before leaving. Very transparent pricing with the escrow holding the payment.", "Clean Worksite & Fair Price"),
        (pro_models[1].id, 5.0, "Elena installed our Level 2 EV charger cleanly with permit-grade conduit bending. Verified safety ground immediately.", "Top Notch Craftsmanship"),
        (pro_models[3].id, 5.0, "Carlos patched two large holes in our hallway drywall. You literally cannot tell there was ever damage there.", "Seamless Drywall Finish"),
        (pro_models[4].id, 5.0, "Priya and her assistant made our apartment look brand new. The oven and shower tile grout look like day one.", "Deep Clean Perfection")
    ]

    for p_id, rating, comment, tag in sample_reviews:
        rev = Review(
            booking_id=None,
            customer_id=demo_customer.id,
            pro_id=p_id,
            rating=rating,
            comment=comment,
            sentiment_tag=tag,
            ai_summary=f"Positive customer review highlighting: {tag}."
        )
        db.add(rev)

    db.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    db = SessionLocal()
    seed_database(db)
    db.close()
