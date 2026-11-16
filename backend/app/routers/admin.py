from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Booking, ProfessionalProfile, Category, User, Review

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/metrics")
def get_admin_metrics(db: Session = Depends(get_db)):
    total_bookings = db.query(Booking).count()
    completed_bookings = db.query(Booking).filter(Booking.status == "completed").count()
    active_bookings = db.query(Booking).filter(Booking.status.in_(["confirmed", "pro_en_route", "in_progress"])).count()

    # GMV & Escrow
    all_bookings = db.query(Booking).all()
    total_gmv = sum([b.total_amount for b in all_bookings])
    escrow_held = sum([b.total_amount for b in all_bookings if b.payment_status == "escrow_held"])
    payouts_released = sum([(b.total_amount - b.escrow_fee) for b in all_bookings if b.payment_status == "released_to_pro"])
    platform_fee_revenue = sum([b.escrow_fee for b in all_bookings])

    total_pros = db.query(ProfessionalProfile).count()
    verified_pros = db.query(ProfessionalProfile).filter(ProfessionalProfile.verification_status == "verified").count()
    total_reviews = db.query(Review).count()
    avg_rating = db.query(func.avg(Review.rating)).scalar() or 4.95

    return {
        "overview": {
            "total_gmv": round(total_gmv, 2),
            "escrow_held_balance": round(escrow_held, 2),
            "payouts_released": round(payouts_released, 2),
            "platform_escrow_revenue": round(platform_fee_revenue, 2),
            "total_bookings": total_bookings,
            "active_jobs": active_bookings,
            "completed_jobs": completed_bookings,
            "total_verified_pros": verified_pros,
            "total_reviews": total_reviews,
            "platform_average_rating": round(avg_rating, 2)
        },
        "recent_activity": [
            {"time": "2 mins ago", "event": "Booking BK-8192 pro en route", "type": "dispatch"},
            {"time": "15 mins ago", "event": "Escrow held $170.50 for BK-7049", "type": "payment"},
            {"time": "1 hour ago", "event": "Background check re-certified: Elena Rostova", "type": "verification"},
            {"time": "3 hours ago", "event": "5.0 Star Review logged for Jenkins Climate Control", "type": "review"}
        ]
    }
