# TBO Smart Travel Copilot

**AI-Powered Virtual Travel Agent Platform**

A comprehensive MERN stack hackathon project featuring rule-based AI for intelligent trip planning, personalized recommendations, safety intelligence, and automated itinerary generation.

---

## 🌟 Project Overview

TBO Smart Travel Copilot is an end-to-end travel planning platform that simulates AI behavior using **rule-based algorithms, decision trees, and scoring systems** - NO machine learning models, NO Python.

### Key Capabilities

- ✈️ **AI Trip Planning** - Natural language query processing with intent classification
- 🏨 **Smart Recommendations** - Weighted scoring algorithms (price 35%, rating 25%, location 20%)
- 🛡️ **Safety Intelligence** - 6-category safety scoring (0-10 scale) with demographic insights
- 📅 **Automated Itineraries** - Day-wise planning with optimized activity scheduling
- 💰 **Dynamic Pricing** - Surge pricing, discounts, and budget optimization
- 🔒 **Complete Auth** - JWT-based authentication with user preferences

---

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express.js** (REST API)
- **MongoDB** + **Mongoose** (database & ODM)
- **JWT** (authentication)
- **Bcrypt** (password hashing)
- **Zod** (request validation)

### Frontend
- **React 18+** + **Vite** (UI framework & build tool)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **React Router** (navigation)
- **Axios** (API client)

### AI Decision Engine (NO ML)
- Intent classification with keyword scoring
- Entity extraction (destination, budget, dates)
- Multi-factor recommendation scoring
- Rule-based safety assessment
- Itinerary generation algorithms
- Dynamic pricing calculations

---

## 📂 Project Structure

\`\`\`
Buffer-Breachers/
├── backend/
│   ├── src/
│   │   ├── models/              # 5 Mongoose schemas (User, Trip, Booking, etc.)
│   │   ├── utils/               # 7 AI decision engine utilities (~2500 lines)
│   │   │   ├── mockData.util.js         # Comprehensive mock datasets
│   │   │   ├── intentParser.util.js     # NLP simulation
│   │   │   ├── recommendationEngine.util.js  # Scoring algorithms
│   │   │   ├── safetyScore.util.js      # Safety assessment
│   │   │   ├── itineraryBuilder.util.js # Automated planning
│   │   │   ├── pricingEngine.util.js    # Dynamic pricing
│   │   │   └── responseFormatter.util.js # Conversational responses
│   │   ├── controllers/         # 6 controllers (auth, copilot, travel, etc.)
│   │   ├── routes/              # 6 route files
│   │   ├── middlewares/         # Auth, validation, error handling
│   │   ├── validators/          # 5 Zod schemas
│   │   └── app/                 # Express setup & server
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/          # Reusable UI components
    │   ├── pages/               # 6 pages (Home, Features, Safety, Dashboard, Demo, Login)
    │   ├── context/             # AuthContext for global state
    │   ├── services/            # API integration layer
    │   └── App.jsx              # Root with routing
    ├── package.json
    └── README.md
\`\`\`

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd Buffer-Breachers
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install

# Create .env file
echo "PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/tbo-travel-copilot
CORS_ORIGIN=http://localhost:5173" > .env

# Start MongoDB (if local)
mongod

# Start backend server
npm run dev
\`\`\`
Backend runs on: **http://localhost:5000**

### 3. Frontend Setup
\`\`\`bash
cd ../frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start frontend
npm run dev
\`\`\`
Frontend runs on: **http://localhost:5173**

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🎯 Core Features

### 1. AI Copilot (Main Feature)
**Endpoint**: `POST /api/copilot/query`

Natural language processing with:
- **10+ Intent Types**: TRIP_PLANNING, HOTEL_SEARCH, FLIGHT_SEARCH, SAFETY_INQUIRY, etc.
- **Entity Extraction**: Destination, budget ("1 lakh", "₹50k"), dates, travel type
- **Context Building**: Merges query with user preferences
- **Clarification Handling**: Requests missing information

**Example Queries**:
- "Plan a trip to Dubai for 5 days with budget of 1 lakh"
- "Show me luxury hotels in Maldives"
- "Is Bangkok safe for solo female travelers?"
- "Find cheapest flights from Mumbai to Goa"

### 2. Recommendation Engine
**Weighted Scoring Algorithm**:

**Hotels**:
- Price (35%) - Lower = better score
- Rating (25%) - Higher = better
- Location (20%) - City center = bonus
- Category (10%) - Matches user preference
- Amenities (10%) - Pool, spa, etc.

**Flights**:
- Price (40%)
- Direct flight (25%) - Non-stop = bonus
- Duration (15%)
- Departure time (10%)
- Class (10%)

**Activities**:
- Category match (35%)
- Price (25%)
- Rating (25%)
- Family-friendly (15%)

### 3. Safety Intelligence
**6-Category Scoring (0-10 scale)**:
- Crime Rate
- Health & Sanitation
- Women Safety
- Solo Traveler Safety
- Natural Disasters
- Political Stability

**Demographic Insights**:
- Women travelers
- Solo travelers
- Family groups
- Elderly travelers

### 4. Itinerary Builder
- **Day 1**: Arrival schedule
- **Middle Days**: 2-3 activities per day with timings
- **Last Day**: Departure schedule
- Meal times and leisure allocation
- Conflict-free scheduling

### 5. Dynamic Pricing
- **Surge Pricing**: Peak season +40%, Low season -20%
- **Advance Booking**: 60+ days -15%, 30-60 days -10%
- **Budget Optimization**: Smart allocation (flights 30-35%, hotels 25-40%, activities 15-20%)
- **Refund Calculator**: Tiered refund based on cancellation timing

---

## 📊 Mock Data

### 8 Destinations
Dubai, Goa, Paris, Maldives, Bangkok, Manali, Singapore, Jaipur

### 12 Hotels
Ranging from budget (₹2k-5k) to luxury (₹25k-50k)

### 8 Flights
Domestic and international routes

### 12 Activities
Adventure, cultural, relaxation, water sports, etc.

### Comprehensive Safety Data
Emergency contacts, safety scores, area ratings for all destinations

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get profile (auth required)
- `PUT /api/auth/profile` - Update profile (auth required)

### AI Copilot
- `POST /api/copilot/query` - Main AI endpoint (auth required)
- `GET /api/copilot/history` - Query history (auth required)
- `POST /api/copilot/feedback` - Submit feedback (auth required)

### Travel
- `POST /api/travel/flights/search` - Search flights
- `POST /api/travel/hotels/search` - Search hotels
- `POST /api/travel/activities/search` - Search activities
- `GET /api/travel/destinations` - List all destinations

### Safety
- `GET /api/safety/destination/:name` - Get safety info
- `GET /api/safety/alerts/:destination` - Active alerts
- `GET /api/safety/demographic/:destination/:demographic` - Demographic safety

### Booking
- `POST /api/booking/create` - Create booking (auth required)
- `GET /api/booking/user` - User bookings (auth required)
- `POST /api/booking/:id/cancel` - Cancel booking (auth required)

### Review
- `POST /api/review` - Submit review (auth required)
- `GET /api/review/:entityId` - Get reviews

---

## 🎨 Frontend Pages

1. **Home** - Hero, features overview, CTA
2. **Features** - Technical deep dive with algorithm specs
3. **Safety** - Interactive safety dashboard with destination selector
4. **Login/Register** - Auth with travel preferences
5. **Dashboard** - User bookings, stats, preferences
6. **Demo** - AI Copilot chat interface (★ core feature)

---

## 🧪 Testing the Platform

### Quick Test Flow
1. **Register**: Create account at `/login` with preferences
2. **Chat**: Go to `/demo` and ask: "Plan a trip to Dubai for 5 days with budget of 1 lakh"
3. **View Results**: See hotels, flights, activities, safety scores, itinerary, cost estimate
4. **Safety Check**: Navigate to `/safety` and select "Dubai"
5. **Dashboard**: View your saved trips at `/dashboard`

### Sample Queries
\`\`\`
"Show me luxury hotels in Maldives"
"Find cheapest flights from Mumbai to Goa"
"Is Bangkok safe for women travelers?"
"Recommend activities in Manali for adventure lovers"
"Plan a family trip to Singapore for 7 days under 2 lakhs"
\`\`\`

---

## 🏆 Hackathon Highlights

### ✅ Rule-Based AI (NO ML)
- Intent classification using keyword scoring
- Entity extraction with regex patterns
- Weighted recommendation algorithms
- Decision trees for safety assessment

### ✅ End-to-End Platform
- Complete authentication system
- Full booking lifecycle
- Safety intelligence integration
- Personalized user experience

### ✅ Production-Ready Architecture
- Modular MVC + Decision Engine layer
- Comprehensive error handling
- Input validation with Zod
- JWT security
- RESTful API design

### ✅ Professional UI/UX
- Responsive design (mobile-first)
- Animated interactions (Framer Motion)
- Conversational AI interface
- Structured data visualization

---

## 📝 Development Notes

### AI Logic Location
All AI decision-making is in `backend/src/utils/`:
- No external AI APIs
- No machine learning models
- Transparent, debuggable algorithms
- Fully customizable scoring weights

### Future Enhancements
- Real-time flight API integration
- Payment gateway
- Email notifications
- Review system
- Group bookings
- Multi-language support

---

## 📄 License

Built for TBO Hackathon - Educational Purpose

---

## 👥 Team

**Buffer Breachers** - MERN Stack Developers

---

## 🙏 Acknowledgments

- TBO Holidays for hackathon opportunity
- Mock data inspired by real travel platforms
- Icons by Lucide React
- Images from Unsplash

---

**🚀 Built with passion for intelligent travel experiences!**
