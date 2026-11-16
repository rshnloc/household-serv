from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed import seed_database
from .routers import auth, categories, pros, ai, bookings, payments, admin

# Create tables
Base.metadata.create_all(bind=engine)

# Seed with clean, realistic verified test data
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="HomeAssist AI - Household Services & Home Assistance Marketplace API",
    description="Backend API powering AI diagnostics, verified pro matching, scheduling, and escrow payments",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(pros.router)
app.include_router(ai.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "HomeAssist AI Marketplace API",
        "version": "1.0.0",
        "escrow_system": "active",
        "ai_engine": "operational"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy"}
