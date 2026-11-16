from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ProfessionalProfile

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Active session user ID (defaults to demo customer)
# For demo simplicity without requiring complex third party cookies
ACTIVE_USER_EMAIL = "customer.demo@homeassist-demo.local"

@router.get("/current-user")
def get_current_user(email: str = Query(None), db: Session = Depends(get_db)):
    target_email = email or ACTIVE_USER_EMAIL
    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        # Fallback to first user
        user = db.query(User).first()
        if not user:
            raise HTTPException(status_code=404, detail="No users found")

    pro_profile_id = None
    if user.role == "pro" and user.pro_profile:
        pro_profile_id = user.pro_profile.id

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "phone_masked": user.phone_masked,
        "avatar_url": user.avatar_url,
        "pro_profile_id": pro_profile_id
    }

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    """Returns the synthetic demo personas for easy one-click switching"""
    users = db.query(User).all()
    result = []
    for u in users:
        pro_title = ""
        if u.role == "pro" and u.pro_profile:
            pro_title = u.pro_profile.tagline
        elif u.role == "customer":
            pro_title = "Verified Homeowner • 742 Evergreen Terrace"
        elif u.role == "admin":
            pro_title = "Platform Trust & Escrow Administrator"

        result.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "title": pro_title,
            "avatar_url": u.avatar_url,
            "pro_id": u.pro_profile.id if u.pro_profile else None
        })
    return result
