import random
import datetime
import json
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Booking, ProfessionalProfile, Category, User, Review, BookingMessage

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

class CreateBookingRequest(BaseModel):
    customer_id: int
    pro_id: int
    title: str
    problem_description: str
    urgency: str # "standard", "priority_same_day", "emergency_24_7"
    scheduled_date: str
    scheduled_time_slot: str
    service_address: str
    estimated_hours: float
    hourly_rate: float
    parts_estimate: float
    escrow_fee: float
    total_amount: float
    payment_method: str = "Mock Card (ending in 4242)"
    customer_notes: Optional[str] = None

class UpdateStatusRequest(BaseModel):
    status: str
    notes: Optional[str] = None

class AddMessageRequest(BaseModel):
    sender_name: str
    sender_role: str
    message_text: str

class AddReviewRequest(BaseModel):
    rating: float
    comment: str

@router.post("")
def create_booking(payload: CreateBookingRequest, db: Session = Depends(get_db)):
    # Verify pro
    pro = db.query(ProfessionalProfile).filter(ProfessionalProfile.id == payload.pro_id).first()
    if not pro:
        raise HTTPException(status_code=404, detail="Selected professional not found")

    # Generate booking reference
    rand_ref = f"BK-{random.randint(1000, 9999)}"
    escrow_id = f"ESC-{random.randint(10000, 99999)}-SIM"

    booking = Booking(
        booking_reference=rand_ref,
        customer_id=payload.customer_id,
        pro_id=payload.pro_id,
        category_id=pro.category_id,
        title=payload.title,
        problem_description=payload.problem_description,
        urgency=payload.urgency,
        scheduled_date=payload.scheduled_date,
        scheduled_time_slot=payload.scheduled_time_slot,
        service_address=payload.service_address,
        estimated_hours=payload.estimated_hours,
        hourly_rate=payload.hourly_rate,
        parts_estimate=payload.parts_estimate,
        escrow_fee=payload.escrow_fee,
        total_amount=payload.total_amount,
        status="confirmed",
        payment_status="escrow_held",
        payment_method=payload.payment_method,
        escrow_transaction_id=escrow_id,
        pro_notes=payload.customer_notes
    )
    db.add(booking)
    db.flush()

    # Initial system message
    sys_msg = BookingMessage(
        booking_id=booking.id,
        sender_name="HomeAssist Escrow Safe",
        sender_role="system",
        message_text=f"Escrow Hold Activated: ${payload.total_amount:.2f} has been secured under Escrow ID {escrow_id}. Funds will only be released to {pro.business_name} once you verify completed service."
    )
    db.add(sys_msg)

    # Pro initial acknowledgment
    pro_msg = BookingMessage(
        booking_id=booking.id,
        sender_name=pro.user.full_name,
        sender_role="pro",
        message_text=f"Hi there! Thank you for choosing {pro.business_name}. I have received your request for {payload.scheduled_date} ({payload.scheduled_time_slot}). I will review the issue notes and arrive fully equipped."
    )
    db.add(pro_msg)

    db.commit()
    db.refresh(booking)

    return {
        "status": "success",
        "booking_id": booking.id,
        "booking_reference": booking.booking_reference,
        "escrow_transaction_id": booking.escrow_transaction_id,
        "total_amount": booking.total_amount,
        "message": "Booking confirmed with escrow protection"
    }

@router.get("/my-bookings")
def get_my_bookings(
    user_id: int = Query(...),
    role: str = Query("customer"),
    db: Session = Depends(get_db)
):
    if role == "pro":
        # Find pro profile for this user
        pro = db.query(ProfessionalProfile).filter(ProfessionalProfile.user_id == user_id).first()
        if not pro:
            return []
        bookings = db.query(Booking).filter(Booking.pro_id == pro.id).order_by(Booking.created_at.desc()).all()
    else:
        bookings = db.query(Booking).filter(Booking.customer_id == user_id).order_by(Booking.created_at.desc()).all()

    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "booking_reference": b.booking_reference,
            "title": b.title,
            "problem_description": b.problem_description,
            "urgency": b.urgency,
            "scheduled_date": b.scheduled_date,
            "scheduled_time_slot": b.scheduled_time_slot,
            "service_address": b.service_address,
            "total_amount": b.total_amount,
            "status": b.status,
            "payment_status": b.payment_status,
            "escrow_transaction_id": b.escrow_transaction_id,
            "category_name": b.category.name,
            "category_slug": b.category.slug,
            "pro_id": b.pro_id,
            "pro_name": b.pro.user.full_name,
            "pro_business": b.pro.business_name,
            "pro_image": b.pro.profile_image,
            "pro_phone": b.pro.user.phone_masked,
            "customer_id": b.customer_id,
            "customer_name": b.customer.full_name,
            "has_review": b.review is not None,
            "review_rating": b.review.rating if b.review else None,
            "created_at": b.created_at.strftime("%b %d, %Y") if b.created_at else ""
        })
    return results

@router.get("/{booking_id}")
def get_booking_detail(booking_id: int, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    messages = db.query(BookingMessage).filter(BookingMessage.booking_id == booking_id).order_by(BookingMessage.created_at.asc()).all()
    msg_list = []
    for m in messages:
        msg_list.append({
            "id": m.id,
            "sender_name": m.sender_name,
            "sender_role": m.sender_role,
            "message_text": m.message_text,
            "time": m.created_at.strftime("%I:%M %p") if m.created_at else ""
        })

    return {
        "id": b.id,
        "booking_reference": b.booking_reference,
        "title": b.title,
        "problem_description": b.problem_description,
        "urgency": b.urgency,
        "scheduled_date": b.scheduled_date,
        "scheduled_time_slot": b.scheduled_time_slot,
        "service_address": b.service_address,
        "estimated_hours": b.estimated_hours,
        "hourly_rate": b.hourly_rate,
        "parts_estimate": b.parts_estimate,
        "escrow_fee": b.escrow_fee,
        "total_amount": b.total_amount,
        "status": b.status,
        "payment_status": b.payment_status,
        "payment_method": b.payment_method,
        "escrow_transaction_id": b.escrow_transaction_id,
        "pro_notes": b.pro_notes,
        "completed_at": b.completed_at.strftime("%b %d, %Y %I:%M %p") if b.completed_at else None,
        "category": {
            "name": b.category.name,
            "slug": b.category.slug,
            "icon": b.category.icon
        },
        "pro": {
            "id": b.pro.id,
            "name": b.pro.user.full_name,
            "business_name": b.pro.business_name,
            "tagline": b.pro.tagline,
            "rating": b.pro.rating,
            "review_count": b.pro.review_count,
            "image": b.pro.profile_image,
            "phone": b.pro.user.phone_masked,
            "license": b.pro.license_number,
            "insured": b.pro.insured_amount
        },
        "customer": {
            "id": b.customer.id,
            "name": b.customer.full_name,
            "email": b.customer.email,
            "phone": b.customer.phone_masked
        },
        "messages": msg_list,
        "review": {
            "rating": b.review.rating,
            "comment": b.review.comment,
            "sentiment_tag": b.review.sentiment_tag
        } if b.review else None
    }

@router.post("/{booking_id}/status")
def update_booking_status(booking_id: int, payload: UpdateStatusRequest, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    valid_statuses = ["confirmed", "pro_en_route", "in_progress", "completed", "cancelled"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    b.status = payload.status
    if payload.notes:
        b.pro_notes = payload.notes

    if payload.status == "completed" and not b.completed_at:
        b.completed_at = datetime.datetime.utcnow()

    # System status notification
    status_display = {
        "pro_en_route": "Technician is now en route with equipment to your service address.",
        "in_progress": "Technician has arrived on site and commenced diagnostic & repair work.",
        "completed": "Work marked complete by technician. Please inspect the results and release escrow funds when satisfied.",
        "cancelled": "Booking was cancelled."
    }
    
    if payload.status in status_display:
        db.add(BookingMessage(
            booking_id=b.id,
            sender_name="System Status Tracker",
            sender_role="system",
            message_text=status_display[payload.status]
        ))

    db.commit()
    return {"status": "success", "new_status": b.status}

@router.post("/{booking_id}/release-escrow")
def release_escrow(booking_id: int, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    b.payment_status = "released_to_pro"
    b.status = "completed"
    if not b.completed_at:
        b.completed_at = datetime.datetime.utcnow()

    # Increment pro jobs completed
    b.pro.jobs_completed += 1

    db.add(BookingMessage(
        booking_id=b.id,
        sender_name="HomeAssist Escrow Safe",
        sender_role="system",
        message_text=f"Escrow Funds Released! Payout of ${(b.total_amount - b.escrow_fee):.2f} has been transferred to {b.pro.business_name}. Thank you for verifying completed work."
    ))

    db.commit()
    return {
        "status": "success",
        "payment_status": "released_to_pro",
        "released_amount": b.total_amount - b.escrow_fee,
        "message": "Funds successfully released to technician"
    }

@router.post("/{booking_id}/messages")
def post_booking_message(booking_id: int, payload: AddMessageRequest, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    msg = BookingMessage(
        booking_id=b.id,
        sender_name=payload.sender_name,
        sender_role=payload.sender_role,
        message_text=payload.message_text
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {
        "id": msg.id,
        "sender_name": msg.sender_name,
        "sender_role": msg.sender_role,
        "message_text": msg.message_text,
        "time": msg.created_at.strftime("%I:%M %p")
    }

@router.post("/{booking_id}/review")
def add_booking_review(booking_id: int, payload: AddReviewRequest, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    if b.review:
        raise HTTPException(status_code=400, detail="Review already submitted for this booking")

    # Simple sentiment tag generation
    if payload.rating >= 4.8:
        sentiment = "Exceptional Quality & Highly Recommended"
    elif payload.rating >= 4.0:
        sentiment = "Great Service & Courteous Professional"
    else:
        sentiment = "Satisfactory Service"

    review = Review(
        booking_id=b.id,
        customer_id=b.customer_id,
        pro_id=b.pro_id,
        rating=payload.rating,
        comment=payload.comment,
        sentiment_tag=sentiment,
        ai_summary=f"Customer rated {payload.rating}/5 stars. Highlighted: {sentiment}."
    )
    db.add(review)

    # Recalculate pro rating
    all_reviews = db.query(Review).filter(Review.pro_id == b.pro_id).all()
    total_stars = sum([r.rating for r in all_reviews]) + payload.rating
    b.pro.review_count = len(all_reviews) + 1
    b.pro.rating = round(total_stars / b.pro.review_count, 2)

    db.commit()
    return {"status": "success", "message": "Review submitted and professional rating updated"}
