import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ProfessionalProfile, Category, Review, User

router = APIRouter(prefix="/api/pros", tags=["pros"])

@router.get("")
def list_pros(
    category_slug: str = Query(None),
    search: str = Query(None),
    min_rating: float = Query(0.0),
    max_rate: float = Query(None),
    emergency_only: bool = Query(False),
    db: Session = Depends(get_db)
):
    query = db.query(ProfessionalProfile).join(Category).join(User)

    if category_slug:
        query = query.filter(Category.slug == category_slug)

    if min_rating > 0:
        query = query.filter(ProfessionalProfile.rating >= min_rating)

    if max_rate:
        query = query.filter(ProfessionalProfile.hourly_rate <= max_rate)

    if emergency_only:
        query = query.filter(ProfessionalProfile.emergency_capable == True)

    pros = query.all()
    results = []

    for p in pros:
        # Search filter if provided
        if search:
            s_lower = search.lower()
            in_name = s_lower in p.user.full_name.lower() or s_lower in p.business_name.lower()
            in_tagline = s_lower in p.tagline.lower() or s_lower in p.bio.lower()
            in_cat = s_lower in p.category.name.lower() or s_lower in p.category.slug.lower()
            skills_list = json.loads(p.skills or "[]")
            in_skills = any(s_lower in sk.lower() for sk in skills_list)
            if not (in_name or in_tagline or in_cat or in_skills):
                continue

        results.append({
            "id": p.id,
            "user_id": p.user_id,
            "full_name": p.user.full_name,
            "business_name": p.business_name,
            "tagline": p.tagline,
            "bio": p.bio,
            "category_id": p.category_id,
            "category_name": p.category.name,
            "category_slug": p.category.slug,
            "hourly_rate": p.hourly_rate,
            "rating": p.rating,
            "review_count": p.review_count,
            "jobs_completed": p.jobs_completed,
            "years_experience": p.years_experience,
            "verification_status": p.verification_status,
            "background_check_cleared": p.background_check_cleared,
            "insured_amount": p.insured_amount,
            "license_number": p.license_number,
            "identity_verified": p.identity_verified,
            "skills": json.loads(p.skills or "[]"),
            "badges": json.loads(p.badges or "[]"),
            "service_radius_miles": p.service_radius_miles,
            "location_city": p.location_city,
            "available_now": p.available_now,
            "emergency_capable": p.emergency_capable,
            "profile_image": p.profile_image
        })

    # Sort by rating and completed jobs
    results.sort(key=lambda x: (x["rating"], x["jobs_completed"]), reverse=True)
    return results

@router.get("/{pro_id}")
def get_pro_detail(pro_id: int, db: Session = Depends(get_db)):
    p = db.query(ProfessionalProfile).filter(ProfessionalProfile.id == pro_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Professional not found")

    reviews = db.query(Review).filter(Review.pro_id == pro_id).order_by(Review.created_at.desc()).all()
    review_list = []
    for r in reviews:
        review_list.append({
            "id": r.id,
            "customer_name": r.customer.full_name if r.customer else "Verified Homeowner",
            "rating": r.rating,
            "comment": r.comment,
            "sentiment_tag": r.sentiment_tag,
            "ai_summary": r.ai_summary,
            "date": r.created_at.strftime("%b %d, %Y") if r.created_at else "Recent"
        })

    return {
        "id": p.id,
        "user_id": p.user_id,
        "full_name": p.user.full_name,
        "business_name": p.business_name,
        "tagline": p.tagline,
        "bio": p.bio,
        "category_id": p.category_id,
        "category_name": p.category.name,
        "category_slug": p.category.slug,
        "hourly_rate": p.hourly_rate,
        "rating": p.rating,
        "review_count": p.review_count,
        "jobs_completed": p.jobs_completed,
        "years_experience": p.years_experience,
        "verification_status": p.verification_status,
        "background_check_cleared": p.background_check_cleared,
        "insured_amount": p.insured_amount,
        "license_number": p.license_number,
        "identity_verified": p.identity_verified,
        "skills": json.loads(p.skills or "[]"),
        "badges": json.loads(p.badges or "[]"),
        "service_radius_miles": p.service_radius_miles,
        "location_city": p.location_city,
        "available_now": p.available_now,
        "emergency_capable": p.emergency_capable,
        "profile_image": p.profile_image,
        "reviews": review_list
    }
