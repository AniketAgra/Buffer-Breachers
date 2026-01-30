# 🧪 Testing Guide - TBO Smart Travel Copilot

Complete guide for testing the AI-powered travel platform.

---

## 🚀 Quick Start Testing

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Expected: Server running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Expected: Vite dev server on http://localhost:5173

**Terminal 3 - MongoDB:**
```bash
mongod
```
✅ Expected: MongoDB running on port 27017

---

## 🔐 Authentication Testing

### Test 1: User Registration
**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

✅ **Validation Tests:**
- ❌ Empty email → 400 error
- ❌ Invalid email format → 400 error
- ❌ Duplicate email → 409 error
- ❌ Password < 6 chars → 400 error

### Test 2: User Login
**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": { ... },
  "token": "..."
}
```

### Test 3: Get Profile (Protected)
**Endpoint:** `GET /api/auth/profile`

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "name": "Test User",
    "email": "test@example.com",
    "preferences": { ... }
  }
}
```

---

## 🤖 AI Copilot Testing

### Test 4: Trip Planning Query
**Endpoint:** `POST /api/copilot/query`

```bash
curl -X POST http://localhost:5000/api/copilot/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Plan a trip to Dubai for 5 days under 1 lakh"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "intent": "TRIP_PLANNING",
  "confidence": 0.92,
  "response": {
    "message": "I've created a perfect 5-day Dubai itinerary...",
    "data": {
      "recommendations": {
        "hotels": [...],
        "flights": [...],
        "activities": [...]
      },
      "itinerary": [...],
      "cost": {
        "flights": 45000,
        "accommodation": 30000,
        "activities": 15000,
        "total": 90000
      },
      "safety": {
        "overallScore": 8.5,
        "categories": [...]
      }
    }
  }
}
```

**Test Variations:**
1. "Show me hotels in Goa under 5000 per night"
2. "Find flights to Bangkok for 2 people"
3. "Is Paris safe for women travelers?"
4. "Create an itinerary for Maldives"
5. "What activities can I do in Manali?"

### Test 5: Intent Classification

**Natural Language Queries to Test:**

| Query | Expected Intent |
|-------|----------------|
| "Plan a trip to Goa" | TRIP_PLANNING |
| "Show me hotels in Dubai" | HOTEL_SEARCH |
| "Find flights to Paris" | FLIGHT_SEARCH |
| "What can I do in Bangkok?" | ACTIVITY_SEARCH |
| "Is Maldives safe?" | SAFETY_INQUIRY |
| "Recommend a destination" | RECOMMENDATION |
| "Tell me about Singapore" | GENERAL_INFO |

### Test 6: Entity Extraction

**Budget Format Tests:**
- "1 lakh" → 100000
- "₹50k" → 50000
- "50000" → 50000
- "2.5 lakhs" → 250000

**Duration Tests:**
- "5 days" → 5
- "1 week" → 7
- "10 days" → 10

---

## 🏨 Travel Search Testing

### Test 7: Hotel Search
**Endpoint:** `POST /api/travel/hotels/search`

```bash
curl -X POST http://localhost:5000/api/travel/hotels/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Dubai",
    "budget": 10000,
    "category": "luxury"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "hotels": [
    {
      "name": "Burj Al Arab",
      "price": 50000,
      "rating": 5,
      "score": 95.5,
      "amenities": ["Pool", "Spa", "WiFi"]
    }
  ]
}
```

### Test 8: Flight Search
**Endpoint:** `POST /api/travel/flights/search`

```bash
curl -X POST http://localhost:5000/api/travel/flights/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Delhi",
    "destination": "Dubai",
    "travelClass": "economy"
  }'
```

### Test 9: Activity Search
**Endpoint:** `POST /api/travel/activities/search`

```bash
curl -X POST http://localhost:5000/api/travel/activities/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Dubai",
    "category": "adventure",
    "budget": 5000
  }'
```

---

## 🛡️ Safety Intelligence Testing

### Test 10: Destination Safety
**Endpoint:** `GET /api/safety/destination/:name`

```bash
curl -X GET http://localhost:5000/api/safety/destination/Dubai
```

**Expected Response:**
```json
{
  "success": true,
  "safety": {
    "overallScore": 8.5,
    "categories": [
      { "name": "Crime Rate", "score": 9.0 },
      { "name": "Women Safety", "score": 8.5 },
      { "name": "Health & Sanitation", "score": 9.5 }
    ],
    "alerts": [...],
    "tips": [...]
  }
}
```

### Test 11: Demographic Safety
**Endpoint:** `GET /api/safety/demographic/:destination/:type`

```bash
# Women safety
curl -X GET http://localhost:5000/api/safety/demographic/Dubai/women

# Solo traveler
curl -X GET http://localhost:5000/api/safety/demographic/Goa/solo

# Family
curl -X GET http://localhost:5000/api/safety/demographic/Paris/family
```

### Test 12: Active Alerts
**Endpoint:** `GET /api/safety/alerts/:destination`

```bash
curl -X GET http://localhost:5000/api/safety/alerts/Bangkok
```

---

## 📝 Booking Flow Testing

### Test 13: Create Booking
**Endpoint:** `POST /api/booking/create`

```bash
curl -X POST http://localhost:5000/api/booking/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "trip": "TRIP_ID_HERE",
    "bookingType": "hotel",
    "bookingDetails": {
      "hotelId": "hotel_123",
      "checkIn": "2026-03-15",
      "checkOut": "2026-03-20",
      "guests": 2
    },
    "totalAmount": 30000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "booking": {
    "bookingReference": "TBO123456",
    "status": "confirmed",
    "totalAmount": 30000,
    "cancellationPolicy": "..."
  }
}
```

### Test 14: Get User Bookings
**Endpoint:** `GET /api/booking/user`

```bash
curl -X GET http://localhost:5000/api/booking/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 15: Cancel Booking
**Endpoint:** `POST /api/booking/:id/cancel`

```bash
curl -X POST http://localhost:5000/api/booking/BOOKING_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Change of plans"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "refundAmount": 24000,
  "refundPercentage": 80,
  "message": "Booking cancelled successfully"
}
```

---

## 🎨 Frontend Testing

### Test 16: UI Navigation

**Homepage (`/`):**
- ✅ Hero section loads
- ✅ Features grid displays
- ✅ Statistics animate
- ✅ CTA buttons navigate correctly

**Features Page (`/features`):**
- ✅ All 6 main features display
- ✅ Tech stack section renders
- ✅ Animations trigger on scroll

**Safety Page (`/safety`):**
- ✅ Destination cards display
- ✅ Click destination → details load
- ✅ Safety score visualization works
- ✅ Category breakdown renders

**Login Page (`/login`):**
- ✅ Toggle between login/signup
- ✅ Form validation works
- ✅ Error messages display
- ✅ Successful login redirects to dashboard

**Dashboard (`/dashboard`):**
- ✅ Protected route (redirects if not logged in)
- ✅ Stats cards display
- ✅ Trips grid renders
- ✅ Bookings table shows data

**Demo Page (`/demo`):**
- ✅ Chat interface loads
- ✅ Message sending works
- ✅ AI responses display
- ✅ Recommendation cards render
- ✅ Loading state shows
- ✅ Suggestion chips clickable

### Test 17: Authentication Flow

1. Navigate to `/login`
2. Click "Sign Up"
3. Fill form: Name, Email, Password
4. Submit → Should redirect to `/dashboard`
5. Refresh page → Should stay logged in
6. Click profile dropdown → Logout
7. Should redirect to home

### Test 18: AI Chat Interactions

**Test Queries in Demo:**

1. **Trip Planning:**
   - "Plan a trip to Dubai for 5 days under 1 lakh"
   - Should show: Hotels, flights, activities, budget breakdown

2. **Hotel Search:**
   - "Show me luxury hotels in Maldives"
   - Should display: Hotel cards with ratings and prices

3. **Flight Search:**
   - "Find flights to Goa for 2 people"
   - Should show: Flight options with prices

4. **Safety Query:**
   - "Is Paris safe for solo women travelers?"
   - Should display: Safety score, tips, warnings

5. **Itinerary:**
   - "Create an itinerary for Bangkok"
   - Should show: Day-wise schedule with activities

---

## 🔍 Edge Case Testing

### Test 19: Error Handling

**Invalid Token:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer INVALID_TOKEN"
```
**Expected:** 401 Unauthorized

**Non-existent Destination:**
```bash
curl -X GET http://localhost:5000/api/safety/destination/Antarctica
```
**Expected:** 404 Not Found

**Invalid Booking ID:**
```bash
curl -X GET http://localhost:5000/api/booking/invalid_id \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** 404 Not Found

### Test 20: Validation Testing

**Missing Required Fields:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "Test" }'
```
**Expected:** 400 Bad Request with validation errors

**Invalid Data Types:**
```bash
curl -X POST http://localhost:5000/api/copilot/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "message": 123 }'
```
**Expected:** 400 Bad Request

---

## 📊 Performance Testing

### Test 21: Response Times

**Expected Response Times:**
- Authentication: < 200ms
- Copilot Query: < 500ms
- Search Endpoints: < 300ms
- Safety Data: < 200ms

**Load Testing (optional):**
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/travel/destinations
```

---

## ✅ Testing Checklist

### Backend
- [ ] All 5 models create/read/update properly
- [ ] JWT authentication works
- [ ] Protected routes require token
- [ ] Validation catches invalid data
- [ ] Error middleware handles errors gracefully
- [ ] MongoDB connection stable
- [ ] All 6 controllers respond correctly

### AI Engine
- [ ] Intent classification accurate
- [ ] Entity extraction works for all formats
- [ ] Recommendation scoring produces valid results
- [ ] Safety scores calculate correctly
- [ ] Itinerary builder generates valid schedules
- [ ] Pricing engine applies discounts properly

### Frontend
- [ ] All pages render without errors
- [ ] Navigation works smoothly
- [ ] Forms validate input
- [ ] API calls succeed
- [ ] Error messages display
- [ ] Loading states show
- [ ] Responsive on mobile/tablet
- [ ] Animations smooth

### Integration
- [ ] Frontend → Backend communication works
- [ ] Auth flow complete (signup → login → protected routes)
- [ ] AI chat returns proper responses
- [ ] Booking flow works end-to-end
- [ ] Safety dashboard loads real data

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
**Solution:**
```bash
# Check if MongoDB is running
mongod --version
# Start MongoDB
mongod
```

### Issue 2: Port Already in Use
**Solution:**
```bash
# Kill process on port 5000
npx kill-port 5000
# Or change port in .env
PORT=5001
```

### Issue 3: CORS Error
**Solution:**
Check `backend/.env`:
```
CORS_ORIGIN=http://localhost:5173
```

### Issue 4: Token Expired
**Solution:**
Delete localStorage token and login again

### Issue 5: Dependencies Not Found
**Solution:**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

## 📝 Test Report Template

```markdown
# Test Report - TBO Travel Copilot

**Date:** [Date]
**Tester:** [Name]
**Environment:** Local Development

## Summary
- Total Tests: 21
- Passed: __
- Failed: __
- Skipped: __

## Detailed Results

### Authentication
- [ ] Registration: PASS/FAIL
- [ ] Login: PASS/FAIL
- [ ] Protected Routes: PASS/FAIL

### AI Copilot
- [ ] Trip Planning: PASS/FAIL
- [ ] Intent Classification: PASS/FAIL
- [ ] Entity Extraction: PASS/FAIL

### Travel Search
- [ ] Hotel Search: PASS/FAIL
- [ ] Flight Search: PASS/FAIL
- [ ] Activity Search: PASS/FAIL

### Safety
- [ ] Destination Safety: PASS/FAIL
- [ ] Demographic Safety: PASS/FAIL
- [ ] Active Alerts: PASS/FAIL

### Booking
- [ ] Create Booking: PASS/FAIL
- [ ] Cancel Booking: PASS/FAIL

### Frontend
- [ ] UI Navigation: PASS/FAIL
- [ ] Auth Flow: PASS/FAIL
- [ ] AI Chat: PASS/FAIL

## Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
- [Recommendation]
```

---

## 🎯 Success Criteria

**✅ Project is ready for demo if:**
- [ ] All core features work
- [ ] No critical bugs
- [ ] UI loads without errors
- [ ] AI chat responds intelligently
- [ ] Authentication secure
- [ ] Safety dashboard functional
- [ ] Booking flow complete

---

**Happy Testing! 🚀**
