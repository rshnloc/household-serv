import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="customer") # "customer", "pro", "admin"
    phone_masked = Column(String(30), default="+1 (555) 019-2831")
    avatar_url = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    pro_profile = relationship("ProfessionalProfile", back_populates="user", uselist=False)
    customer_bookings = relationship("Booking", back_populates="customer", foreign_keys="Booking.customer_id")
    reviews_written = relationship("Review", back_populates="customer")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    icon = Column(String(50), default="Wrench")
    description = Column(Text, nullable=False)
    base_hourly_rate = Column(Float, default=75.0)
    urgency_multiplier = Column(Float, default=1.5)
    popular_tasks = Column(Text, default="[]") # JSON list of strings

    pros = relationship("ProfessionalProfile", back_populates="category")
    bookings = relationship("Booking", back_populates="category")

class ProfessionalProfile(Base):
    __tablename__ = "professional_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    business_name = Column(String(150), nullable=False)
    tagline = Column(String(250), nullable=False)
    bio = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    hourly_rate = Column(Float, nullable=False)
    rating = Column(Float, default=4.9)
    review_count = Column(Integer, default=24)
    jobs_completed = Column(Integer, default=48)
    years_experience = Column(Integer, default=7)
    
    # Verification details (Ensures safety, trust, and zero real credentials)
    verification_status = Column(String(20), default="verified") # verified, pending, unverified
    background_check_cleared = Column(Boolean, default=True)
    insured_amount = Column(String(50), default="$1,000,000 General Liability")
    license_number = Column(String(50), default="LIC-TRADE-9921")
    identity_verified = Column(Boolean, default=True)
    skills = Column(Text, default="[]") # JSON list
    badges = Column(Text, default="[]") # JSON list
    service_radius_miles = Column(Integer, default=25)
    location_city = Column(String(100), default="Metro Area")
    available_now = Column(Boolean, default=True)
    emergency_capable = Column(Boolean, default=True)
    profile_image = Column(String(300), nullable=True)

    # Relationships
    user = relationship("User", back_populates="pro_profile")
    category = relationship("Category", back_populates="pros")
    bookings = relationship("Booking", back_populates="pro", foreign_keys="Booking.pro_id")
    reviews = relationship("Review", back_populates="pro")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_reference = Column(String(30), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pro_id = Column(Integer, ForeignKey("professional_profiles.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    problem_description = Column(Text, nullable=False)
    urgency = Column(String(30), default="standard") # "standard", "priority_same_day", "emergency_24_7"
    scheduled_date = Column(String(30), nullable=False)
    scheduled_time_slot = Column(String(50), nullable=False)
    service_address = Column(String(250), nullable=False)
    
    # Pricing & Escrow
    estimated_hours = Column(Float, default=2.0)
    hourly_rate = Column(Float, default=85.0)
    parts_estimate = Column(Float, default=35.0)
    escrow_fee = Column(Float, default=15.0)
    total_amount = Column(Float, default=220.0)
    
    status = Column(String(30), default="confirmed") 
    # "pending_confirmation", "confirmed", "pro_en_route", "in_progress", "completed", "cancelled"
    
    payment_status = Column(String(30), default="escrow_held") 
    # "escrow_held", "released_to_pro", "refunded"
    
    payment_method = Column(String(50), default="Mock Card (ending in 4242)")
    escrow_transaction_id = Column(String(60), default="ESC-99201-SIM")
    
    pro_notes = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship("User", back_populates="customer_bookings", foreign_keys=[customer_id])
    pro = relationship("ProfessionalProfile", back_populates="bookings", foreign_keys=[pro_id])
    category = relationship("Category", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False)
    messages = relationship("BookingMessage", back_populates="booking", cascade="all, delete-orphan")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pro_id = Column(Integer, ForeignKey("professional_profiles.id"), nullable=False)
    
    rating = Column(Float, nullable=False) # 1.0 - 5.0
    comment = Column(Text, nullable=False)
    sentiment_tag = Column(String(50), default="Highly Recommended")
    ai_summary = Column(String(250), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="review")
    customer = relationship("User", back_populates="reviews_written")
    pro = relationship("ProfessionalProfile", back_populates="reviews")

class BookingMessage(Base):
    __tablename__ = "booking_messages"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    sender_name = Column(String(100), nullable=False)
    sender_role = Column(String(20), nullable=False) # "customer", "pro", "system"
    message_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="messages")
