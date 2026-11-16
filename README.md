# HomeAssist AI — Household Services & Home Assistance Marketplace

An intelligent, full-stack household services marketplace where customers can find, book, schedule, and pay verified trade professionals with **AI-powered diagnostic triage** and **secure escrow payment holding**.

Built purely with **Python (FastAPI)** and **TypeScript (React + Vite + Tailwind CSS)**. **No Docker required.**

---

## 🔒 Privacy & Security Guarantee
- **Zero Real Personal Data (PII):** All customer names, telephone numbers, physical addresses, and trade contractor identities are 100% synthetic demo personas (`Jordan Blake`, `Marcus Vance`, `Elena Rostova`, etc.).
- **Zero Live or Expired Credentials:** No real API keys, secrets, passwords, or live financial endpoints are used or committed. The marketplace uses simulated escrow locking and offline-capable heuristic AI triage.
- **No Third-Party Tracking / No Docker:** Runs natively with standard Python virtualenv and Node/npm.

---

## 🚀 Key Features

### 1. 🤖 HomeGenie AI™ Diagnostic & Triage Assistant
- **Natural Language Triage:** Describe home problems in everyday words (e.g., *"Water dripping from kitchen sink P-trap"*, *"Hallway breaker buzzes and trips"*, *"AC blowing warm air in heatwave"*).
- **Critical Safety Detection:** Immediately flags hazardous situations (gas leaks, electrical arcing, water flood shutoff) with high-priority safety guidance.
- **Transparent Price Estimator:** Calculates realistic itemized cost breakdowns (hourly labor, required OEM parts/materials, and platform escrow protection fee).
- **Instant Pro Matching:** Ranks top verified specialists by trade certifications, proximity radius, ratings, and emergency capability.

### 2. 🛡️ Verified Professional Credentials
- Every listed pro undergoes simulated multi-point verification:
  - **Trade License Verification:** Verified state license numbers (e.g., `MPL-90482-STATE`).
  - **Insurance & Bonding:** $1,000,000 to $2,000,000 commercial liability coverage.
  - **Criminal Background Check:** 100% cleared screening status.
  - **Skill Assessments & Ratings:** Customer reviews with AI sentiment summaries.

### 3. 🔒 Safe Escrow Payment Vault
- When a customer books a service, funds are placed into **Escrow Vault Holding**.
- Funds are only released to the professional after the customer inspects and signs off on the completed work.
- Automated invoice and printable tax receipt generation with itemized labor, parts, and satisfaction guarantee certificate.

### 4. 📅 Scheduling & Live Job Status Timeline
- Interactive booking calendar with flexible arrival windows (Morning, Midday, Afternoon, Evening).
- Live 4-stage job tracking:
  1. `Confirmed & Scheduled`
  2. `Technician En Route`
  3. `Work In Progress`
  4. `Completed & Signed Off`
- In-app real-time messaging between homeowner and technician.

### 5. 🔄 1-Click Demo Persona Switcher
Switch instantly between 3 roles in the navbar:
- **👤 Jordan Blake (Customer):** Browse marketplace, run AI triage, book pros, track active jobs, release escrow payments, write reviews.
- **⚡ Marcus Vance (Licensed Trade Pro):** View assigned jobs, update dispatch status (En Route, In Progress, Complete), chat with customer.
- **🛡️ Marketplace Overseer (Admin):** View platform GMV, active escrow balance, pro compliance queue, and platform fee statistics.

---

## 🛠️ Tech Stack

- **Backend:** Python 3.10+, FastAPI, SQLAlchemy, SQLite, Pydantic, Uvicorn
- **Frontend:** TypeScript, React 18, Vite, Tailwind CSS, Lucide React
- **Runtime:** Native macOS / Linux / Windows (No Docker)

---

## 🚦 Quick Start

### Option A: One-Command Startup
```bash
./run.sh
```

### Option B: Manual Startup

**1. Start the Backend:**
```bash
# Create and activate virtual environment
python3 -m venv backend/venv
source backend/venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic sqlalchemy pyjwt httpx python-multipart

# Start server
PYTHONPATH=backend uvicorn app.main:app --host 127.0.0.1 --port 8000
```

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Open **`http://127.0.0.1:5173`** in your browser.

---

## 📂 Project Structure

```
household-serv/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app & CORS setup
│   │   ├── database.py          # SQLite engine & sessions
│   │   ├── models.py            # SQLAlchemy models (User, Pro, Booking, Review, Messages)
│   │   ├── seed.py              # Rich, realistic, verified synthetic test data
│   │   ├── ai_engine.py         # AI Triage, Safety Hazard, Scope & Cost Engine
│   │   └── routers/
│   │       ├── auth.py          # Demo personas & role switching
│   │       ├── categories.py    # 9 Household categories & pro counts
│   │       ├── pros.py          # Verified contractor profiles, search & filters
│   │       ├── ai.py            # /api/ai/diagnose & quick prompts
│   │       ├── bookings.py      # Bookings, status transitions, escrow releases
│   │       ├── payments.py      # Escrow receipts & invoices
│   │       └── admin.py         # Platform metrics, GMV, Escrow vault
│   └── homehero.db              # SQLite database (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Navigation & 1-click persona switch
│   │   │   ├── CategoryBar.tsx        # 9 Category pills with icons
│   │   │   ├── AiAssistantHero.tsx    # Interactive search & triage hero
│   │   │   ├── AiAssistantModal.tsx   # HomeGenie AI triage modal
│   │   │   ├── ProCard.tsx            # Contractor cards with badges & rate
│   │   │   ├── ProDetailModal.tsx     # Full credentials, license, reviews
│   │   │   ├── BookingModal.tsx       # Date, slot, urgency & escrow checkout
│   │   │   ├── BookingsList.tsx       # Active & past bookings list
│   │   │   ├── BookingTrackerModal.tsx# Live timeline, messaging, escrow release
│   │   │   ├── AdminDashboard.tsx     # GMV, Escrow vault balance & metrics
│   │   │   └── ReceiptModal.tsx       # Printable itemized invoice & receipt
│   │   ├── services/
│   │   │   └── api.ts                 # Typed fetch client
│   │   ├── types/
│   │   │   └── index.ts               # Complete TypeScript interfaces
│   │   ├── App.tsx                    # Main orchestrator
│   │   └── main.tsx                   # React mount
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── run.sh                             # One-click startup script
└── README.md
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | List all 9 household categories with verified pro counts |
| `GET` | `/api/pros` | Search & filter verified pros (category, rating, emergency, rate) |
| `GET` | `/api/pros/{id}` | Detailed pro profile with licenses, insurance, and reviews |
| `POST` | `/api/ai/diagnose` | Run AI diagnostic triage, detect safety hazards & price quote |
| `POST` | `/api/bookings` | Create booking and lock funds into simulated Escrow |
| `GET` | `/api/bookings/my-bookings` | List active bookings for current demo user |
| `POST` | `/api/bookings/{id}/status` | Update dispatch status (En Route, In Progress, Completed) |
| `POST` | `/api/bookings/{id}/release-escrow` | Release held escrow payment to pro after customer sign-off |
| `POST` | `/api/bookings/{id}/messages` | Send message in booking thread |
| `POST` | `/api/bookings/{id}/review` | Submit customer review & update pro rating |
| `GET` | `/api/payments/receipt/{id}` | Generate itemized escrow tax invoice & receipt |
| `GET` | `/api/admin/metrics` | Platform GMV, escrow vault balance, and activity stream |
