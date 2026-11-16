import json
from fastapi import APIRouter, Depends, Body
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ProfessionalProfile, Category, User
from ..ai_engine import analyze_household_issue

router = APIRouter(prefix="/api/ai", tags=["ai"])

class DiagnoseRequest(BaseModel):
    query_text: str
    custom_urgency: Optional[str] = None
    max_pros: int = 3

@router.post("/diagnose")
def run_ai_diagnose(payload: DiagnoseRequest, db: Session = Depends(get_db)):
    # 1. Run diagnostic engine
    diagnostic_result = analyze_household_issue(payload.query_text, payload.custom_urgency)

    # 2. Find matching verified professionals in this trade
    matched_category_slug = diagnostic_result["category_slug"]
    
    pros_query = db.query(ProfessionalProfile).join(Category).join(User).filter(
        Category.slug == matched_category_slug,
        ProfessionalProfile.verification_status == "verified"
    )

    if diagnostic_result["detected_urgency"] == "emergency_24_7":
        pros_query = pros_query.filter(ProfessionalProfile.emergency_capable == True)

    pros = pros_query.order_by(ProfessionalProfile.rating.desc()).limit(payload.max_pros).all()

    # Fallback to any pros if specific category is empty
    if not pros:
        pros = db.query(ProfessionalProfile).limit(payload.max_pros).all()

    matched_pros = []
    for p in pros:
        matched_pros.append({
            "id": p.id,
            "full_name": p.user.full_name,
            "business_name": p.business_name,
            "tagline": p.tagline,
            "hourly_rate": p.hourly_rate,
            "rating": p.rating,
            "review_count": p.review_count,
            "jobs_completed": p.jobs_completed,
            "badges": json.loads(p.badges or "[]"),
            "license_number": p.license_number,
            "insured_amount": p.insured_amount,
            "available_now": p.available_now,
            "profile_image": p.profile_image
        })

    diagnostic_result["matched_professionals"] = matched_pros
    return diagnostic_result

@router.get("/quick-prompts")
def get_quick_prompts():
    return [
        {
            "title": "Kitchen Sink Pipe Drip",
            "category": "Plumbing",
            "prompt": "Persistent water dripping under the kitchen sink P-trap whenever the faucet is on. Base cabinet bottom is getting damp."
        },
        {
            "title": "Breaker Tripping & Buzzing",
            "category": "Electrical",
            "prompt": "Hallway circuit breaker buzzes loudly when microwave and toaster are on at same time, then trips the switch."
        },
        {
            "title": "AC Warm Air & High Hum",
            "category": "HVAC",
            "prompt": "Central AC compressor fan runs outside but vents are blowing lukewarm air. Temperature inside is rising."
        },
        {
            "title": "Washing Machine Won't Drain",
            "category": "Appliance",
            "prompt": "Front load washer stops at 12 minutes with E24 drainage code and soapy water standing in drum."
        },
        {
            "title": "Drywall Patch & TV Mount",
            "category": "Handyman",
            "prompt": "Need to securely mount a 75-inch TV into metal studs and patch a 4-inch doorknob hole in the hallway."
        },
        {
            "title": "Move-Out Deep Sanitization",
            "category": "Cleaning",
            "prompt": "Full move-out deep clean for a 2-bedroom home: oven grease, shower tile grout, interior window tracks, and steam vacuum."
        }
    ]
