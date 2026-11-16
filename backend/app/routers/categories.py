import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Category, ProfessionalProfile

router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    results = []
    for c in categories:
        pro_count = db.query(ProfessionalProfile).filter(
            ProfessionalProfile.category_id == c.id,
            ProfessionalProfile.verification_status == "verified"
        ).count()

        results.append({
            "id": c.id,
            "slug": c.slug,
            "name": c.name,
            "icon": c.icon,
            "description": c.description,
            "base_hourly_rate": c.base_hourly_rate,
            "urgency_multiplier": c.urgency_multiplier,
            "popular_tasks": json.loads(c.popular_tasks or "[]"),
            "verified_pros_count": pro_count
        })
    return results
