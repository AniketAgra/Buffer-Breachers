# 🔐 Authentication System - Client vs Agent

## 📋 How It Works

### ✅ Unified System (Role-Based)

We use a **single authentication system** with role differentiation, not separate systems. This is cleaner and more maintainable.

## 🎯 Registration Flow

### Option 1: Registration with Role Selection (Implemented) ✅

**Frontend:** User chooses role during registration

```jsx
// User sees two cards during registration:
┌─────────────┐  ┌─────────────┐
│   Client    │  │Travel Agent │
│  👤 User    │  │  ✈️ Plane   │
│ Looking to  │  │  Managing   │
│   travel    │  │   clients   │
└─────────────┘  └─────────────┘
```

**API Request:**
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CLIENT" | "AGENT",  // User selects
  
  // For CLIENTS:
  "preferences": {
    "budget": "mid-range",
    "travelStyle": "solo"
  },
  
  // For AGENTS:
  "agentDetails": {
    "license": "TA-12345",
    "specialization": ["luxury", "adventure"]
  }
}
```

**Backend Logic:**
```javascript
// In auth.controller.js
- Validates role (CLIENT or AGENT)
- Defaults to CLIENT if not specified
- Creates user with appropriate fields
- Returns role in response
```

### Option 2: Create Agent via Script (Still Available)

For testing or admin purposes:

```bash
cd backend
node createAgent.js
# Follow prompts to create agent or convert user
```

## 🔑 Login Flow

### Single Login Endpoint

**API:**
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response includes role:
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CLIENT" | "AGENT",  // Backend sends role
    "preferences": {...},        // For clients
    "agentDetails": {...}        // For agents
  },
  "token": "jwt_token..."
}
```

**Frontend Redirect:**
```javascript
// In Login.jsx
if (userData.role === 'AGENT') {
  navigate('/agent/dashboard');
} else {
  navigate('/dashboard');
}
```

## 🛡️ Security & Access Control

### Route Protection

```javascript
// Agent routes protected by:
authenticate()  // Verify JWT
+ requireAgent()  // Check role === 'AGENT'

// Client routes protected by:
authenticate()  // Verify JWT
+ requireClient() // Check role === 'CLIENT'
```

### Role Checking

```javascript
// In role.middleware.js

export const requireAgent = (req, res, next) => {
  if (req.user.role !== 'AGENT') {
    return res.status(403).json({
      message: 'Access denied. Agent role required.'
    });
  }
  next();
};

export const requireClient = (req, res, next) => {
  if (req.user.role !== 'CLIENT') {
    return res.status(403).json({
      message: 'Access denied. Client role required.'
    });
  }
  next();
};
```

## 📊 Registration UI Breakdown

### Client Registration
```
┌──────────────────────────────┐
│ Name: John Doe               │
│ Email: john@example.com      │
│ Password: ********           │
│                              │
│ [✓ Client] [ Travel Agent ]  │ ← Role Selection
│                              │
│ Travel Preferences:          │ ← Client-specific
│ Budget: [Mid-Range ▼]        │
│ Style:  [Solo ▼]             │
│                              │
│ [ Create Account ]           │
└──────────────────────────────┘
```

### Agent Registration
```
┌──────────────────────────────┐
│ Name: Jane Agent             │
│ Email: jane@travel.com       │
│ Password: ********           │
│                              │
│ [ Client ] [✓ Travel Agent]  │ ← Role Selection
│                              │
│ Agent Details (Optional):    │ ← Agent-specific
│ License: TA-12345            │
│ Specialization: Luxury,      │
│                 Adventure    │
│                              │
│ [ Create Account ]           │
└──────────────────────────────┘
```

## 🔄 Role Switching During Registration

When user clicks role button:
```javascript
// Automatically switches form fields
Client → Agent:
  ❌ Hide: Travel Preferences
  ✅ Show: Agent Details

Agent → Client:
  ❌ Hide: Agent Details
  ✅ Show: Travel Preferences
```

## 🎯 API Endpoints Summary

```
Authentication (Public):
├── POST /api/auth/register  ← Supports role parameter
├── POST /api/auth/login     ← Returns user with role
└── GET  /api/auth/profile   ← Returns full user data

Agent Routes (AGENT only):
├── GET  /api/agent/dashboard
├── GET  /api/agent/clients
└── POST /api/agent/trips

Client Routes (CLIENT only):
├── GET  /api/booking/user
└── GET  /api/review/user/me
```

## ✅ Testing Different Roles

### Test as Client:
1. Go to `/login`
2. Click "Create Account"
3. Select **Client** role
4. Fill preferences
5. Register → Redirected to `/dashboard`

### Test as Agent:
1. Go to `/login`
2. Click "Create Account"
3. Select **Travel Agent** role
4. Fill agent details
5. Register → Redirected to `/agent/dashboard`

### Test Login:
1. Login with any account
2. System automatically redirects based on role
3. No need to specify role during login

## 🔐 Security Features

1. **Password Hashing:** ✅ bcrypt with salt
2. **JWT Tokens:** ✅ Secure, expiring tokens
3. **Role Validation:** ✅ Middleware checks
4. **Default Role:** ✅ CLIENT (safe default)
5. **Role Immutability:** ✅ Role can't be changed via profile update

## 🎨 User Experience

### Benefits:
- ✅ **Single registration page** (not confusing)
- ✅ **Visual role selection** (clear choice)
- ✅ **Context-aware forms** (shows relevant fields)
- ✅ **Automatic redirect** (no manual navigation)
- ✅ **Role persistence** (stays in token)

### UX Flow:
```
Register → Choose Role → Fill Details → Submit
                ↓
         Backend Creates User
                ↓
         Returns JWT + Role
                ↓
         Frontend Redirects
         /          \
    /dashboard   /agent/dashboard
```

## 🚀 Production Considerations

### Enhancements to Add (Optional):

1. **Email Verification:**
```javascript
- Send verification email
- Block login until verified
- Different verification for agents?
```

2. **Agent Approval:**
```javascript
- New agents start as "pending"
- Admin approves agents
- Status: pending → approved → active
```

3. **Role Change Request:**
```javascript
- Users can request role change
- Admin approves
- Audit trail maintained
```

4. **OAuth Integration:**
```javascript
- Google/Microsoft login
- Auto-detect role from domain?
- Corporate agents via SSO
```

## 📝 Summary

| Feature | Implementation |
|---------|---------------|
| **Registration** | Single endpoint with role parameter |
| **Login** | Single endpoint, role in response |
| **Role Selection** | Visual UI during registration |
| **Default Role** | CLIENT |
| **Access Control** | Middleware-based |
| **Frontend Routing** | Role-based redirect |
| **Security** | JWT + Role validation |

---

**🎯 Result:** Clean, unified authentication system with clear role separation and excellent UX! ✨
