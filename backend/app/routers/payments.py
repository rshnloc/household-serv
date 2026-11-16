import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Booking

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.get("/receipt/{booking_id}")
def get_payment_receipt(booking_id: int, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    labor_subtotal = round(b.estimated_hours * b.hourly_rate, 2)

    return {
        "invoice_number": f"INV-{b.booking_reference}",
        "escrow_id": b.escrow_transaction_id,
        "date": b.created_at.strftime("%B %d, %Y") if b.created_at else datetime.date.today().strftime("%B %d, %Y"),
        "customer_name": b.customer.full_name,
        "service_address": b.service_address,
        "service_name": b.title,
        "category": b.category.name,
        "pro_business_name": b.pro.business_name,
        "pro_license": b.pro.license_number,
        "payment_method": b.payment_method,
        "payment_status": b.payment_status,
        "line_items": [
            {
                "description": f"Verified Trade Labor ({b.estimated_hours} hrs @ ${b.hourly_rate}/hr)",
                "amount": labor_subtotal
            },
            {
                "description": "OEM Parts, Fittings & Consumables Allocation",
                "amount": b.parts_estimate
            },
            {
                "description": "HomeAssist Escrow Vault & $1,000,000 Guarantee Protection",
                "amount": b.escrow_fee
            }
        ],
        "total": b.total_amount,
        "escrow_guarantee_text": "Protected by HomeAssist Escrow Protection. Funds held securely until customer verifies job satisfaction."
    }
