# TBO Smart Travel Copilot - Backend API

AI-powered Virtual Travel Agent backend with rule-based intelligence.

## 🏗️ Architecture

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schemas
- **Architecture**: MVC + Decision Engine Layer

## 📁 Project Structure

```
backend/
├── src/
│   ├── app/                    # Express app & server
│   ├── config/                 # Configuration
│   ├── db/                     # Database connection
│   ├── models/                 # Mongoose models
│   ├── controllers/            # Route controllers
│   ├── routes/                 # Express routes
│   ├── middlewares/            # Custom middleware
│   ├── validators/             # Zod validation schemas
│   ├── utils/                  # Decision engine utilities
│   │   ├── intentParser.util.js       # NLP simulation
│   │   ├── recommendationEngine.util.js # Scoring & ranking
│   │   ├── safetyScore.util.js       # Safety assessment
│   │   ├── itineraryBuilder.util.js  # Itinerary generation
│   │   ├── pricingEngine.util.js     # Dynamic pricing
│   │   ├── mockData.util.js          # Static datasets
│   │   └── responseFormatter.util.js # Response formatting
│   └── index.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### AI Copilot 🤖
- `POST /api/copilot/query` - Main AI query endpoint (Protected)
- `GET /api/copilot/history` - Get conversation history (Protected)
- `POST /api/copilot/feedback` - Submit feedback (Protected)

### Travel
- `POST /api/travel/flights/search` - Search flights
- `POST /api/travel/hotels/search` - Search hotels
- `POST /api/travel/activities/search` - Search activities
- `GET /api/travel/destinations` - Get all destinations
- `GET /api/travel/destinations/:id` - Get destination details

### Safety
- `GET /api/safety/destination/:name` - Get safety score
- `GET /api/safety/alerts/:destination` - Get active alerts
- `GET /api/safety/areas/:destination` - Get area-wise safety
- `POST /api/safety/report` - Report safety concern (Protected)

### Booking
- `POST /api/booking/create` - Create booking (Protected)
- `GET /api/booking/user` - Get user bookings (Protected)
- `GET /api/booking/:id` - Get booking details (Protected)
- `POST /api/booking/:id/cancel` - Cancel booking (Protected)
- `PUT /api/booking/:id/modify` - Modify booking (Protected)

### Reviews
- `POST /api/review` - Create review (Protected)
- `GET /api/review/:entityId` - Get reviews for entity
- `GET /api/review/user/me` - Get user reviews (Protected)

## 🤖 AI Decision Engine

The AI Copilot uses a **rule-based decision engine** (no ML):

### Intent Classification
- Keyword matching
- Token scoring
- Confidence calculation

### Entity Extraction
- Destination parsing
- Budget extraction (supports "1 lakh", "₹50000", "50k")
- Duration extraction
- Travel type identification

### Recommendation Algorithm
```javascript
Score = (PriceScore × 0.35) + (RatingScore × 0.25) + 
        (LocationScore × 0.20) + (CategoryMatch × 0.10) + 
        (PreferenceMatch × 0.10)
```

### Safety Assessment
- Category-wise scoring (crime, health, women safety, etc.)
- Contextual warnings (travel type, time of arrival)
- Area-wise ratings
- Demographic-specific advice

## 🧪 Testing the API

### Example: AI Copilot Query

```bash
# 1. Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Query Copilot (use token from login)
curl -X POST http://localhost:5000/api/copilot/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "message": "Plan a 4-day Dubai trip for family under 1 lakh"
  }'
```

## 🎯 Core Features

### 1. Natural Language Processing (Simulated)
- Intent classification with 10+ categories
- Entity extraction (destination, budget, duration, preferences)
- Context building from user queries

### 2. Intelligent Recommendations
- Hotels: Scored by price, rating, location, preferences
- Flights: Ranked by price, duration, stops, timing
- Activities: Filtered by category, price, family-friendliness

### 3. Safety Intelligence
- Destination safety scores (0-10 scale)
- Category ratings: crime, health, women safety, solo traveler
- Contextual warnings based on travel type
- Emergency contacts database

### 4. Itinerary Generation
- Day-wise schedules
- Arrival/departure day optimization
- Activity distribution
- Time allocation

### 5. Dynamic Pricing
- Surge pricing simulation
- Early booking discounts
- Group discounts
- Refund calculation

## 🔧 Development Notes

### Adding New Destinations
Edit `src/utils/mockData.util.js`:
```javascript
export const destinations = [
  {
    id: 'new-destination',
    name: 'Destination Name',
    // ... add properties
  }
];
```

### Modifying Scoring Weights
Edit `src/utils/recommendationEngine.util.js`:
```javascript
const scoreHotel = (hotel, context) => {
  // Adjust weights here
  score += (hotel.price <= budget) ? 35 : 10; // Price: 35%
  score += (hotel.rating / 5) * 25;           // Rating: 25%
  // ...
};
```

## 📊 Database Models

- **User**: Authentication & preferences
- **Trip**: Trip planning & itineraries
- **Booking**: Bookings management
- **SafetyAlert**: Safety warnings
- **Review**: User reviews

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Input validation (Zod)
- CORS protection
- MongoDB injection prevention

## 📝 License

MIT

## 👨‍💻 Author

Built for TBO Hackathon 2026
