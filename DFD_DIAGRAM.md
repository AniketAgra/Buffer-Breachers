# Data Flow Diagram (DFD) - TBO Smart Travel Copilot

## Level 0 DFD (Context Diagram)

```
                                    ┌─────────────────────────────────────┐
                                    │                                     │
                                    │   TBO Smart Travel Copilot System   │
                                    │                                     │
                                    └─────────────────────────────────────┘
                                                    │
                        ┌───────────────────────────┼───────────────────────────┐
                        │                           │                           │
                    User Data                   AI Query                    Booking Request
                Auth Request                 Travel Search              Dashboard Request
                        │                           │                           │
                        ▼                           ▼                           ▼
        ┌───────────────────────────┐   ┌───────────────────────┐   ┌──────────────────────┐
        │                           │   │                       │   │                      │
        │     External User         │   │   Registered User     │   │   Authenticated      │
        │   (Guest/New Visitor)     │   │   (AI Copilot User)   │   │   User (Bookings)    │
        │                           │   │                       │   │                      │
        └───────────────────────────┘   └───────────────────────┘   └──────────────────────┘
                        │                           │                           │
                 Search Results             AI Recommendations            Booking Details
                 Destinations Info          Safety Scores                Trip History
                 Public Data                Itineraries                  Reviews
                        │                           │                           │
                        └───────────────────────────┼───────────────────────────┘
                                                    │
                                    ┌───────────────▼───────────────┐
                                    │                               │
                                    │     MongoDB Database          │
                                    │  (Users, Trips, Bookings,     │
                                    │   Reviews, Safety Alerts)     │
                                    │                               │
                                    └───────────────────────────────┘
```

---

## Level 1 DFD (System Overview)

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                    FRONTEND (React)                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Home     │  │   Features  │  │    Safety    │  │   AI Demo    │  │  Dashboard   │ │
│  │    Page     │  │     Page    │  │     Page     │  │ (Copilot UI) │  │     Page     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                │                │                 │                 │          │
│         └────────────────┴────────────────┴─────────┬───────┴─────────────────┘          │
│                                                      │                                    │
│                                          ┌───────────▼──────────┐                         │
│                                          │   API Services       │                         │
│                                          │  (Axios Client)      │                         │
│                                          └───────────┬──────────┘                         │
└──────────────────────────────────────────────────────┼───────────────────────────────────┘
                                                       │
                                              HTTP Requests
                                                       │
┌──────────────────────────────────────────────────────┼───────────────────────────────────┐
│                                    BACKEND (Express/Node.js)                               │
│                                                      │                                    │
│                              ┌───────────────────────▼────────────────────┐               │
│                              │          Express Router                     │               │
│                              │    (CORS, Body Parser, Error Handler)       │               │
│                              └───────────────────────┬────────────────────┘               │
│                                                      │                                    │
│         ┌────────────────────┬────────────────┬─────┼──────┬──────────────┬──────────┐   │
│         │                    │                │     │      │              │          │   │
│    ┌────▼─────┐     ┌───────▼────┐    ┌─────▼─────▼──┐  ┌▼────────┐  ┌─▼────────┐  │   │
│    │   Auth   │     │  Copilot   │    │    Travel    │  │ Booking │  │  Safety  │  │   │
│    │  Routes  │     │   Routes   │    │    Routes    │  │ Routes  │  │  Routes  │  │   │
│    └────┬─────┘     └───────┬────┘    └─────┬────────┘  └┬────────┘  └─┬────────┘  │   │
│         │                   │                │            │             │           │   │
│    ┌────▼─────┐     ┌───────▼────┐    ┌─────▼────────┐  ┌▼────────┐  ┌─▼────────┐  │   │
│    │   Auth   │     │  Copilot   │    │    Travel    │  │ Booking │  │  Safety  │  │   │
│    │Controller│     │ Controller │    │  Controller  │  │Controll.│  │Controll. │  │   │
│    └────┬─────┘     └───────┬────┘    └─────┬────────┘  └┬────────┘  └─┬────────┘  │   │
│         │                   │                │            │             │           │   │
│         │            ┌──────▼────────────────▼────────────▼─────────────┘           │   │
│         │            │                                                               │   │
│         │            │          AI DECISION ENGINE (7 Utilities)                     │   │
│         │            │                                                               │   │
│         │            │  ┌───────────────────┐  ┌────────────────────────┐           │   │
│         │            │  │  Intent Parser    │  │  Recommendation Engine │           │   │
│         │            │  │  (NLP Simulation) │  │  (Scoring Algorithms)  │           │   │
│         │            │  └───────────────────┘  └────────────────────────┘           │   │
│         │            │                                                               │   │
│         │            │  ┌───────────────────┐  ┌────────────────────────┐           │   │
│         │            │  │  Safety Score     │  │  Itinerary Builder     │           │   │
│         │            │  │  (Risk Assessment)│  │  (Day-wise Planning)   │           │   │
│         │            │  └───────────────────┘  └────────────────────────┘           │   │
│         │            │                                                               │   │
│         │            │  ┌───────────────────┐  ┌────────────────────────┐           │   │
│         │            │  │  Pricing Engine   │  │  Response Formatter    │           │   │
│         │            │  │  (Dynamic Pricing)│  │  (Natural Language)    │           │   │
│         │            │  └───────────────────┘  └────────────────────────┘           │   │
│         │            │                                                               │   │
│         │            │  ┌────────────────────────────────────────────────┐           │   │
│         │            │  │         Mock Data Utility                      │           │   │
│         │            │  │  (Destinations, Hotels, Flights, Activities)   │           │   │
│         │            │  └────────────────────────────────────────────────┘           │   │
│         │            │                                                               │   │
│         │            └────────────────────────┬──────────────────────────────────────┘   │
│         │                                     │                                          │
│    ┌────▼──────────────────────────────┬─────▼──────────┬─────────────┬─────────────┐   │
│    │                                   │                │             │             │   │
│  ┌─▼────────┐  ┌────────────┐  ┌──────▼─────┐  ┌──────▼─────┐  ┌───▼───────┐  ┌──▼──┐ │
│  │   User   │  │    Trip    │  │  Booking   │  │   Review   │  │  Safety   │  │Auth │ │
│  │  Model   │  │   Model    │  │   Model    │  │   Model    │  │   Alert   │  │ MW  │ │
│  └────┬─────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  │   Model   │  └─────┘ │
│       │              │               │               │          └─────┬─────┘          │
│       └──────────────┴───────────────┴───────────────┴────────────────┘                │
│                                             │                                           │
└─────────────────────────────────────────────┼───────────────────────────────────────────┘
                                              │
                                    ┌─────────▼────────┐
                                    │                  │
                                    │  MongoDB         │
                                    │  Database        │
                                    │                  │
                                    │  Collections:    │
                                    │  - users         │
                                    │  - trips         │
                                    │  - bookings      │
                                    │  - reviews       │
                                    │  - safetyalerts  │
                                    │                  │
                                    └──────────────────┘
```

---

## Level 2 DFD (Detailed Process Flow)

### 1. Authentication Process
```
┌────────────┐                                                          ┌─────────────┐
│            │  1. Registration Data (email, password, name)            │             │
│   User     ├─────────────────────────────────────────────────────────►│   Auth      │
│ (Frontend) │                                                          │ Controller  │
│            │◄─────────────────────────────────────────────────────────┤             │
└────────────┘  2. JWT Token + User Profile                             └──────┬──────┘
                                                                               │
                                                                   3. Hash Password (bcrypt)
                                                                   4. Store User Data
                                                                               │
                                                                               ▼
                                                                        ┌─────────────┐
┌────────────┐                                                          │             │
│            │  5. Login Credentials                                    │    User     │
│   User     ├─────────────────────────────────────────────────────────►│   Model     │
│ (Frontend) │                                                          │  (MongoDB)  │
│            │◄─────────────────────────────────────────────────────────┤             │
└────────────┘  6. JWT Token + User Profile                             └─────────────┘
                   (if credentials valid)
```

### 2. AI Copilot Query Processing
```
┌────────────┐                                                          ┌─────────────┐
│            │  1. Natural Language Query                               │             │
│   User     │     "Plan a trip to Dubai for 5 days                     │  Copilot    │
│ (Frontend) │      with budget of 1 lakh"                              │ Controller  │
│            ├─────────────────────────────────────────────────────────►│             │
└────────────┘                                                          └──────┬──────┘
                                                                               │
                                                               ┌───────────────┼───────────────┐
                                                               │               │               │
                                                        ┌──────▼──────┐  ┌─────▼────────┐  ┌─▼─────────┐
                                                        │   Intent    │  │   Entity     │  │  Context  │
                                                        │   Parser    │  │  Extraction  │  │  Builder  │
                                                        │             │  │              │  │           │
                                                        └──────┬──────┘  └─────┬────────┘  └─┬─────────┘
                                                               │               │             │
                                                         Identifies:      Extracts:      Merges:
                                                         - TRIP_PLAN     - Dubai        - User prefs
                                                         - Confidence    - 5 days       - Budget
                                                               │         - ₹1,00,000    - Query data
                                                               │               │             │
                                                               └───────────────┼─────────────┘
                                                                               │
                                                               ┌───────────────▼───────────────┐
                                                               │                               │
                                                       ┌───────┼───────┐           ┌───────────┼──────────┐
                                                       │               │           │                      │
                                                ┌──────▼──────┐  ┌─────▼────────┐ ┌▼─────────────┐  ┌────▼──────┐
                                                │Recommenda-  │  │   Safety     │ │  Itinerary   │  │  Pricing  │
                                                │tion Engine  │  │   Score      │ │   Builder    │  │  Engine   │
                                                │             │  │  Calculator  │ │              │  │           │
                                                └──────┬──────┘  └─────┬────────┘ └┬─────────────┘  └────┬──────┘
                                                       │               │           │                     │
                                                  Searches:      Calculates:   Generates:        Calculates:
                                                  - Hotels       - Crime: 7/10  - Day 1-5        - Flight: ₹25k
                                                  - Flights      - Health: 9    - Activities     - Hotel: ₹45k
                                                  - Activities   - Political: 8 - Timings        - Activities: ₹15k
                                                  (from Mock     - Overall: 8.2                  - Total: ₹85k
                                                   Data Util)                                     (Within budget)
                                                       │               │           │                     │
                                                       └───────────────┼───────────┼─────────────────────┘
                                                                       │           │
                                                                ┌──────▼───────────▼──────┐
                                                                │  Response Formatter     │
                                                                │  (Natural Language)     │
                                                                └──────┬──────────────────┘
                                                                       │
                                                                Formats:
                                                                - Structured JSON
                                                                - Natural language text
                                                                - Recommendations
                                                                - Warnings/Tips
                                                                       │
┌────────────┐                                                  ┌──────▼──────┐
│            │  7. Comprehensive AI Response                    │   Trip      │
│   User     │     - Hotels (3 options)                         │   Model     │
│ (Frontend) │     - Flights (3 options)                        │  (Optional  │
│            │     - 5-day Itinerary                            │   Storage)  │
│            │◄────- Safety Score: 8.2/10                       │             │
└────────────┘     - Total Cost: ₹85,000                        └─────────────┘
                   - Tips & Warnings
```

### 3. Travel Search Process
```
┌────────────┐                                                          ┌─────────────┐
│            │  1. Search Request                                       │             │
│   User     │     - Flight (origin, dest, date)                        │   Travel    │
│ (Frontend) │     - Hotel (location, dates, guests)                    │ Controller  │
│            │     - Activity (location, type)                          │             │
│            ├─────────────────────────────────────────────────────────►└──────┬──────┘
└────────────┘                                                                 │
                                                                               │
                                                                        ┌──────▼──────┐
                                                                        │   Request   │
                                                                        │  Validation │
                                                                        │    (Zod)    │
                                                                        └──────┬──────┘
                                                                               │
                                                                        ┌──────▼──────┐
                                                                        │   Mock      │
                                                                        │   Data      │
                                                                        │   Utility   │
                                                                        └──────┬──────┘
                                                                               │
                                                                        Filters by:
                                                                        - Location
                                                                        - Dates
                                                                        - Budget
                                                                        - Preferences
                                                                               │
┌────────────┐                                                          ┌──────▼──────┐
│            │  2. Search Results                                       │ Recommenda- │
│   User     │     - Sorted by relevance                                │tion Engine  │
│ (Frontend) │     - Price range                                        │  (Scoring)  │
│            │◄────- Ratings & reviews                                  │             │
└────────────┘     - Availability                                       └─────────────┘
```

### 4. Booking Process
```
┌────────────┐                                                          ┌─────────────┐
│            │  1. Booking Request                                      │             │
│   User     │     - Trip details                                       │   Booking   │
│ (Frontend) │     - Payment info (simulated)                           │ Controller  │
│            │     - Traveler info                                      │             │
│            ├─────────────────────────────────────────────────────────►└──────┬──────┘
└────────────┘                                                                 │
                                                                               │
                                                                   ┌───────────┼───────────┐
                                                                   │           │           │
                                                            ┌──────▼──────┐  ┌─▼────────┐  │
                                                            │    Auth     │  │ Validate │  │
                                                            │ Middleware  │  │ Request  │  │
                                                            │  (JWT)      │  │  (Zod)   │  │
                                                            └──────┬──────┘  └─┬────────┘  │
                                                                   │           │           │
                                                                   └───────────┼───────────┘
                                                                               │
                                                                        ┌──────▼──────┐
                                                                        │   Create    │
                                                                        │   Booking   │
                                                                        │   Record    │
                                                                        └──────┬──────┘
                                                                               │
                                                                               ▼
                                                                        ┌─────────────┐
┌────────────┐                                                          │   Booking   │
│            │  2. Booking Confirmation                                 │    Model    │
│   User     │     - Booking ID                                         │  (MongoDB)  │
│ (Frontend) │     - Confirmation details                               │             │
│            │◄────- Status: CONFIRMED                                  └─────────────┘
└────────────┘     - E-ticket (simulated)
```

### 5. Dashboard & User Data Flow
```
┌────────────┐                                                          ┌─────────────┐
│            │  1. Request Dashboard Data                               │             │
│   User     │     (with JWT token)                                     │    Auth     │
│ (Frontend) │                                                          │ Controller  │
│            ├─────────────────────────────────────────────────────────►│             │
└────────────┘                                                          └──────┬──────┘
                                                                               │
                                                                        ┌──────▼──────┐
                                                                        │    Auth     │
                                                                        │ Middleware  │
                                                                        │  (Verify    │
                                                                        │   JWT)      │
                                                                        └──────┬──────┘
                                                                               │
                                                               ┌───────────────┼───────────────┐
                                                               │               │               │
                                                        ┌──────▼──────┐  ┌─────▼────────┐  ┌─▼─────────┐
                                                        │   Fetch     │  │   Fetch      │  │  Fetch    │
                                                        │   Bookings  │  │   Reviews    │  │  Profile  │
                                                        └──────┬──────┘  └─────┬────────┘  └─┬─────────┘
                                                               │               │             │
                                                               ▼               ▼             ▼
                                                        ┌─────────────┐  ┌────────────┐  ┌──────────┐
                                                        │   Booking   │  │   Review   │  │   User   │
                                                        │    Model    │  │   Model    │  │  Model   │
                                                        └──────┬──────┘  └─────┬──────┘  └─┬────────┘
                                                               │               │           │
                                                               └───────────────┼───────────┘
                                                                               │
┌────────────┐                                                                 │
│            │  2. Dashboard Data                                              │
│   User     │     - Active bookings                                           │
│ (Frontend) │     - Past trips                                                │
│            │◄────- Reviews & ratings                                         │
└────────────┘     - User statistics                                           │
                   - Preferences                                ┌──────────────▼──────────┐
                                                                │      MongoDB            │
                                                                │  (Aggregated Queries)   │
                                                                └─────────────────────────┘
```

### 6. Safety Intelligence Flow
```
┌────────────┐                                                          ┌─────────────┐
│            │  1. Request Safety Data                                  │             │
│   User     │     - Destination name                                   │   Safety    │
│ (Frontend) │                                                          │ Controller  │
│            ├─────────────────────────────────────────────────────────►│             │
└────────────┘                                                          └──────┬──────┘
                                                                               │
                                                                        ┌──────▼──────┐
                                                                        │   Safety    │
                                                                        │   Score     │
                                                                        │   Utility   │
                                                                        └──────┬──────┘
                                                                               │
                                                                        Calculates:
                                                                        - Crime (0-10)
                                                                        - Health (0-10)
                                                                        - Political (0-10)
                                                                        - Natural Disasters
                                                                        - Transport Safety
                                                                        - Tourist Security
                                                                               │
                                                                        ┌──────▼──────┐
                                                                        │   Safety    │
                                                                        │   Alert     │
                                                                        │   Model     │
                                                                        └──────┬──────┘
                                                                               │
┌────────────┐                                                                 │
│            │  2. Safety Report                                               │
│   User     │     - Overall Score: 8.2/10                                     │
│ (Frontend) │     - 6 Category Scores                                         │
│            │◄────- Demographic Insights                                      │
└────────────┘     - Travel Advisories                                         │
                   - Recommended Precautions                                   ▼
                                                                        ┌─────────────┐
                                                                        │   MongoDB   │
                                                                        │  (Optional  │
                                                                        │   Storage)  │
                                                                        └─────────────┘
```

---

## Data Stores

### MongoDB Collections

1. **users**
   - _id, name, email, password (hashed)
   - preferences (budget, travelStyle, accommodation)
   - createdAt, updatedAt

2. **trips**
   - _id, userId, destination, startDate, endDate
   - status, totalCost, activities[]
   - createdAt, updatedAt

3. **bookings**
   - _id, userId, tripId, type (flight/hotel/activity)
   - details, status, totalCost
   - createdAt, updatedAt

4. **reviews**
   - _id, userId, bookingId, rating, comment
   - helpful count, createdAt

5. **safetyalerts**
   - _id, destination, alertType, severity
   - description, validUntil, createdAt

---

## External Entities

1. **Guest User**: Can search flights, hotels, activities, view destinations
2. **Registered User**: Full access to AI Copilot, bookings, dashboard
3. **Authenticated User**: Can manage bookings, write reviews, view history

---

## Key Processes

| Process ID | Process Name | Input | Output |
|------------|--------------|-------|--------|
| P1 | User Registration | User details | JWT token, User profile |
| P2 | User Login | Credentials | JWT token |
| P3 | AI Query Processing | Natural language query | AI recommendations |
| P4 | Intent Classification | User query | Intent type, confidence |
| P5 | Entity Extraction | Query text | Destination, dates, budget |
| P6 | Recommendation Scoring | User preferences, options | Ranked results |
| P7 | Safety Assessment | Destination | Safety scores (6 categories) |
| P8 | Itinerary Generation | Trip details | Day-wise plan |
| P9 | Dynamic Pricing | Booking details | Final price |
| P10 | Booking Creation | Trip selection | Booking confirmation |
| P11 | Search Flights/Hotels | Search criteria | Filtered results |
| P12 | Dashboard Data Fetch | User ID | Bookings, stats, reviews |

---

## Data Flows Summary

### Input Flows (User → System)
- Registration/Login credentials
- Natural language queries
- Search parameters (flights, hotels, activities)
- Booking requests
- Review submissions
- Profile updates

### Processing Flows (Within System)
- Intent parsing and entity extraction
- Recommendation scoring (multi-factor algorithm)
- Safety score calculation (6 categories)
- Itinerary generation (day-wise planning)
- Dynamic pricing (surge, discounts, seasonality)
- JWT validation and authentication

### Output Flows (System → User)
- JWT tokens and user profiles
- AI-generated recommendations
- Search results (flights, hotels, activities)
- Booking confirmations
- Dashboard statistics
- Safety intelligence reports
- Error messages and validations

### Storage Flows (System ↔ Database)
- User CRUD operations
- Booking create/read/update
- Trip history storage
- Review storage
- Safety alert queries

---

## Security & Middleware

1. **Authentication Middleware**
   - Validates JWT tokens
   - Attaches user to request object
   - Protects sensitive routes

2. **Validation Middleware**
   - Zod schema validation
   - Request body/query/params validation
   - Returns 400 on validation errors

3. **Error Handling Middleware**
   - Catches all errors
   - Formats error responses
   - Logs errors for debugging

---

## Technology Flow

```
User Browser → React Components → Axios API Client → Express Routes
→ Middleware (Auth, Validation) → Controllers → Utilities (AI Engine)
→ Models (Mongoose) → MongoDB Database
```

---

## Notes

- **No Machine Learning**: All AI behavior is simulated using rule-based algorithms
- **Mock Data**: Flights, hotels, activities from comprehensive mock datasets
- **Real-time**: No actual external API calls for demo purposes
- **JWT Auth**: Stateless authentication with token-based security
- **Scalable**: Modular architecture allows easy extension
