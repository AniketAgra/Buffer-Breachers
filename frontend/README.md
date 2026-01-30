# TBO Smart Travel Copilot - Frontend

React-based frontend for TBO Smart Travel Copilot with AI-powered trip planning interface.

## Tech Stack

- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - API communication
- **Lucide React** - Icon library

## Features

### Pages
1. **Home** - Landing page with hero, features, and CTA
2. **Features** - Detailed platform capabilities and technical specs
3. **Safety** - Interactive safety intelligence dashboard
4. **Login/Register** - Authentication with travel preferences
5. **Dashboard** - User bookings, stats, and trip management
6. **Demo** - AI Copilot chat interface (core feature)

### Components
- **Layout**: Navbar, Footer with responsive design
- **Common**: Button, Input, Card, Modal, Badge (reusable components)
- **AI Chat**: Conversational interface with structured data rendering

### Key Capabilities
- Real-time AI copilot chat with intent-based responses
- Structured data display (hotels, flights, activities, safety scores)
- Animated UI with Framer Motion
- Responsive design (mobile-first)
- Authentication with JWT
- API proxy configuration for development

## Setup

### 1. Install Dependencies
\`\`\`bash
cd frontend
npm install
\`\`\`

### 2. Environment Variables
Create \`.env\` file:
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Runs on: http://localhost:5173

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`

### 5. Preview Production Build
\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── common/        # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Badge.jsx
│   │   └── layout/        # Layout components
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Features.jsx       # Platform features
│   │   ├── Safety.jsx         # Safety dashboard
│   │   ├── Login.jsx          # Auth page
│   │   ├── Dashboard.jsx      # User dashboard
│   │   └── Demo.jsx           # AI Copilot chat
│   ├── services/
│   │   ├── api.js             # Axios instance
│   │   └── endpoints.js       # API endpoints
│   ├── App.jsx                # Root component with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── .env                    # Environment variables
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies
\`\`\`

## API Integration

All API calls are centralized in \`src/services/\`:

- **authAPI**: register, login, profile management
- **copilotAPI**: AI query processing, history
- **travelAPI**: flights, hotels, activities search
- **safetyAPI**: safety scores, alerts, demographic checks
- **bookingAPI**: booking CRUD operations
- **reviewAPI**: review system

Axios interceptors handle:
- JWT token attachment
- Auto-redirect on 401 (token expiration)
- Global error handling

## Key Pages

### Demo (AI Copilot Chat)
- Conversational AI interface
- Intent-based response rendering
- Structured data display (hotels, flights, activities)
- Safety scores visualization
- Cost estimates breakdown
- Follow-up suggestions
- Suggestion chips for quick queries

### Safety Dashboard
- Destination selector (8 destinations)
- Overall safety score with 0-10 scale
- 6 category breakdown (crime, health, women safety, etc.)
- Color-coded progress bars
- Safety advisories and recommendations
- Demographic-specific insights

### Dashboard
- Booking statistics
- Upcoming trips
- Cost tracking
- User preferences management
- Quick actions for trip planning

## Styling

### Tailwind Configuration
- Custom primary color palette (blue shades)
- Custom animations (fade-in, slide-up)
- Utility classes for common patterns
- Custom scrollbar styling

### Component Classes
- \`.btn-primary\` - Primary button style
- \`.btn-secondary\` - Secondary button style
- \`.card\` - Card container with shadow
- \`.input-field\` - Standardized input styling

## Authentication Flow

1. User registers/logs in via \`/login\`
2. JWT token stored in localStorage
3. AuthContext provides global auth state
4. Protected routes check authentication
5. API calls auto-include token
6. Token expiration triggers logout

## Development Tips

1. **API Proxy**: Vite proxies \`/api\` to backend (no CORS issues)
2. **Hot Reload**: Component changes reflect instantly
3. **Error Handling**: Check browser console for API errors
4. **Responsive**: Test on mobile with DevTools
5. **Animations**: Framer Motion powers all transitions

## Production Deployment

1. Update \`.env\` with production API URL
2. Build: \`npm run build\`
3. Deploy \`dist/\` folder to hosting (Vercel, Netlify, etc.)
4. Configure environment variables on hosting platform

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Performance

- Code splitting with React.lazy (future enhancement)
- Image optimization with proper formats
- Minimal bundle size with tree shaking
- Vite's fast HMR for development

---

Built for TBO Hackathon | Rule-Based AI | MERN Stack
