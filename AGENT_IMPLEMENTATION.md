# Agent Role Implementation Guide

## 🎯 Overview

This implementation extends the existing MERN travel website to support an **Agent role** alongside the existing Client role. Agents can manage multiple clients, compare deals intelligently, and plan optimized trips without breaking any existing client functionality.

## 🚀 What's New

### Backend Changes

#### 1. User Model Extension
**File:** `backend/src/models/User.model.js`

```javascript
// New fields added:
role: {
  type: String,
  enum: ['CLIENT', 'AGENT'],
  default: 'CLIENT',
}
agentDetails: {
  license: String,
  specialization: [String],
  clients: [{ type: ObjectId, ref: 'User' }],
}
```

#### 2. Role-Based Middleware
**File:** `backend/src/middlewares/role.middleware.js`

- `requireAgent()` - Ensures only agents can access agent routes
- `requireClient()` - Ensures only clients can access client routes
- `requireRole(...roles)` - Flexible role checking

#### 3. Agent Routes & Controllers
**Files:**
- `backend/src/routes/agent.routes.js`
- `backend/src/controllers/agent.controller.js`
- `backend/src/services/agent.service.js`

**Agent APIs:**
```
GET    /api/agent/dashboard      - Agent statistics
GET    /api/agent/clients        - List all clients
POST   /api/agent/clients        - Assign client to agent
POST   /api/agent/deals/compare  - Compare deals
POST   /api/agent/deals/validate - Validate deal selection
POST   /api/agent/trips          - Create trip plan
GET    /api/agent/trips          - List trip plans
GET    /api/agent/trips/:id      - Get trip details
PUT    /api/agent/trips/:id      - Update trip plan
DELETE /api/agent/trips/:id      - Delete trip plan
```

#### 4. Deal Intelligence Layer
**File:** `backend/src/services/deal.service.js`

**Key Features:**
- Compares 5+ deals automatically
- Scores deals based on:
  - Price (30% weight)
  - Safety (25% weight)
  - Rating (20% weight)
  - Preference match (15% weight)
  - Value (10% weight)
- Flags cheaper/safer alternatives
- Generates actionable insights

**Example Usage:**
```javascript
const comparison = await compareDeals({
  destination: 'Dubai',
  startDate: '2026-03-01',
  endDate: '2026-03-07',
  budget: 50000,
  travelers: 2,
  preferences: { accommodation: 'hotel' }
});
```

#### 5. Trip Model Updates
**File:** `backend/src/models/Trip.model.js`

```javascript
// New fields:
agentId: ObjectId          // Agent who created the plan
selectedDeal: Mixed        // Best deal selected
alternatives: [Mixed]      // Alternative deals
insights: [Mixed]          // Deal insights
dealValidation: Mixed      // Validation warnings
```

#### 6. Enhanced Copilot for Agents
**File:** `backend/src/controllers/copilot.controller.js`

- Automatically runs deal comparison for agents
- Provides agent-specific insights
- Warns if better deals exist
- Suggests optimal alternatives

**Agent Response Example:**
```javascript
{
  response: { /* standard response */ },
  agentInsights: {
    dealsAnalyzed: 5,
    bestDealSavings: 8000,
    warnings: [...],
    opportunities: [...],
    copilotRecommendation: "⚠️ Found a cheaper alternative..."
  }
}
```

### Frontend Changes

#### 1. Role-Based Authentication
**File:** `frontend/src/context/AuthContext.jsx`

```javascript
// New methods:
isAgent()  // Returns true if user is agent
isClient() // Returns true if user is client
```

#### 2. Updated Routing
**File:** `frontend/src/App.jsx`

```javascript
// Agent Routes:
/agent/dashboard    - Agent dashboard
/agent/deals        - Deal comparison tool
/agent/clients      - Client management
/agent/trips/plan   - Trip planner

// Client Routes (unchanged):
/dashboard          - Client dashboard
/demo               - AI Copilot
```

#### 3. Agent Dashboard Components

**Files Created:**
- `frontend/src/pages/agent/AgentDashboard.jsx`
- `frontend/src/pages/agent/DealManager.jsx`
- `frontend/src/pages/agent/ClientManager.jsx`
- `frontend/src/pages/agent/TripPlanner.jsx`

**Key Features:**
- Real-time statistics
- Client portfolio management
- Advanced deal comparison
- Visual insights and warnings

#### 4. Updated Navigation
**File:** `frontend/src/components/layout/Navbar.jsx`

- Shows different menu items based on role
- Agent sees: Dashboard, Deals, Clients
- Client sees: Dashboard, AI Copilot

#### 5. API Service Extensions
**File:** `frontend/src/services/endpoints.js`

```javascript
export const agentAPI = {
  getDashboard: () => api.get('/agent/dashboard'),
  getClients: () => api.get('/agent/clients'),
  assignClient: (email) => api.post('/agent/clients', { clientEmail: email }),
  compareDeals: (criteria) => api.post('/agent/deals/compare', criteria),
  // ... more endpoints
}
```

## 📊 Deal Scoring Algorithm

### Score Breakdown

```
Composite Score = 
  (Price Score × 0.30) +
  (Safety Score × 0.25) +
  (Rating Score × 0.20) +
  (Preference Match × 0.15) +
  (Value Score × 0.10)
```

### Price Score
- ≤70% of budget: 100 points
- 71-90% of budget: 80 points
- 91-100% of budget: 60 points
- 101-120% of budget: 40 points
- >120% of budget: 20 points

### Safety Score
- Converted from 0-10 scale to 0-100
- Direct mapping: (safetyScore / 10) × 100

### Value Score
- Balances quality (rating + safety) against price
- Formula: `((rating + safety) / 2) × (100 / priceRatio)`

## 🔧 Testing the Implementation

### Creating an Agent User

**Option 1: Manual Database Update**
```javascript
// In MongoDB
db.users.updateOne(
  { email: "agent@example.com" },
  { $set: { role: "AGENT" } }
)
```

**Option 2: During Registration**
Temporarily modify the User model default or create a separate registration endpoint.

### Testing Agent Features

1. **Login as Agent**
   ```
   POST /api/auth/login
   { "email": "agent@example.com", "password": "password" }
   ```

2. **Add a Client**
   ```
   POST /api/agent/clients
   { "clientEmail": "client@example.com" }
   ```

3. **Compare Deals**
   ```
   POST /api/agent/deals/compare
   {
     "destination": "Dubai",
     "startDate": "2026-03-01",
     "endDate": "2026-03-07",
     "budget": 50000,
     "travelers": 2
   }
   ```

4. **Create Trip Plan**
   ```
   POST /api/agent/trips
   {
     "clientId": "client_id_here",
     "destination": "Dubai",
     "startDate": "2026-03-01",
     "endDate": "2026-03-07",
     "budget": 50000,
     "travelers": 2
   }
   ```

## 🎨 UI Features

### Agent Dashboard
- **Statistics Cards**: Total clients, active bookings, active plans, revenue
- **Quick Actions**: Compare deals, manage clients, plan trips
- **Performance Metrics**: Booking stats, average values
- **Tips Panel**: Best practices for agents

### Deal Manager
- **Search Form**: Multi-criteria deal search
- **Best Deal Card**: Highlighted recommended option
- **Alternatives List**: Ranked alternatives with comparisons
- **Insights Panel**: Color-coded warnings and opportunities

### Client Manager
- **Client Cards**: Name, email, booking stats, preferences
- **Add Client Modal**: Assign new clients
- **Client Details**: View full client information

### Trip Planner
- **3-Step Process**:
  1. Enter trip details
  2. Review best deals
  3. Confirm and create
- **Deal Insights**: Shows savings, warnings, alternatives
- **Client Context**: Displays client preferences

## 🔒 Security

### Role-Based Access Control
```javascript
// All agent routes protected by:
router.use(authenticate);      // Verify JWT
router.use(requireAgent);      // Check AGENT role
```

### Client Data Protection
- Agents can only access their assigned clients
- Client routes remain protected with `requireClient`
- No cross-role data access

## 🚧 Migration Guide

### Existing Users
- All existing users default to `CLIENT` role
- No impact on existing functionality
- Client routes and features unchanged

### Database Migration
No migration needed! New fields have defaults:
- `role`: defaults to 'CLIENT'
- `agentDetails`: optional field

## 📈 Performance Considerations

### Deal Comparison
- Generates 5 mock deals per query (configurable)
- Scoring is rule-based (no ML overhead)
- Response time: ~100-200ms

### Caching Opportunities
- Cache destination data
- Cache safety scores
- Implement Redis for frequent queries

## 🎯 Demo Scenarios

### Scenario 1: Budget-Conscious Client
```javascript
// Agent searches for deals with ₹30,000 budget
// System finds deals at ₹25,000, ₹28,000, ₹32,000
// Agent insights: "Best deal is ₹5,000 under budget. 
//                  Consider upgrading accommodation."
```

### Scenario 2: Safety-First Family
```javascript
// Agent searches for family trip
// System prioritizes safety score
// Agent insights: "⚠️ Alternative has 1.5 points higher 
//                  safety score for only ₹2,000 more"
```

### Scenario 3: Last-Minute Booking
```javascript
// Booking within 7 days
// System applies 15% premium
// Agent insights: "Peak season + last-minute. Prices 
//                  40% higher than optimal booking window"
```

## 🛠️ Customization

### Adjusting Score Weights
Edit `backend/src/services/deal.service.js`:
```javascript
const weights = {
  price: 0.30,        // Adjust as needed
  safety: 0.25,
  rating: 0.20,
  preferenceMatch: 0.15,
  value: 0.10,
};
```

### Adding Custom Insights
Edit `generateInsights()` function to add new logic:
```javascript
// Example: Early bird discount reminder
if (daysUntilTrip > 90) {
  insights.push({
    type: 'opportunity',
    severity: 'good',
    message: 'Very early booking! Potential for 20% discount.'
  });
}
```

## 📝 Code Conventions

- **Naming**: `camelCase` for variables/functions, `PascalCase` for components
- **File Structure**: Feature-based organization
- **Error Handling**: Try-catch with meaningful messages
- **Comments**: JSDoc for functions, inline for complex logic

## ✅ What's Preserved

- ✅ All existing client functionality
- ✅ Client dashboard unchanged
- ✅ Booking system unchanged
- ✅ Review system unchanged
- ✅ Safety system unchanged
- ✅ Copilot for clients unchanged

## 🚀 Next Steps (Optional Enhancements)

1. **Real-time Notifications**: Notify agents of deal changes
2. **Client Portal**: Let clients view agent recommendations
3. **Commission Tracking**: Track agent earnings
4. **Advanced Analytics**: Deal conversion rates, client LTV
5. **Team Features**: Multi-agent collaboration
6. **Integration**: Connect to real booking APIs (Amadeus, Sabre)

## 📞 Support

For questions or issues:
- Check error messages in browser console
- Review server logs in terminal
- Verify role assignments in database
- Ensure all dependencies are installed

---

**Built with ❤️ for hackathon excellence!**
