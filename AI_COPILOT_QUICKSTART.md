# AI Copilot - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

Before you begin, you'll need:

1. **OpenAI API Key** - Get it from [OpenAI Platform](https://platform.openai.com/)
2. **Pinecone API Key** - Get it from [Pinecone](https://www.pinecone.io/)
3. **MongoDB** - Running locally or remote connection string

### Step 1: Install Dependencies

Already done! The following packages have been installed:

**Backend:**
- `@pinecone-database/pinecone` - Vector database client
- `socket.io` - Real-time communication
- `openai` - OpenAI API client
- `uuid` - Unique ID generation

**Frontend:**
- `socket.io-client` - Socket.IO client

### Step 2: Configure Environment

1. Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` and add your API keys:
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Pinecone Configuration
PINECONE_API_KEY=your-actual-pinecone-key-here
PINECONE_ENVIRONMENT=gcp-starter
PINECONE_INDEX_NAME=travel-copilot
```

### Step 3: Initialize Knowledge Base

Run the initialization script to populate the vector database:

```bash
cd backend
node initializeKnowledgeBase.js
```

This will:
- Create Pinecone index if it doesn't exist
- Load travel knowledge, policies, and destination info
- Generate embeddings for semantic search

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Test the AI Copilot

1. Open browser to `http://localhost:5173`
2. Register/Login to the application
3. Navigate to AI Copilot (Agent Dashboard → AI Copilot)
4. Start chatting!

## 🎯 Features

### 1. RAG (Retrieval-Augmented Generation)
The AI uses a knowledge base to provide accurate, contextual responses:
- Corporate travel policies
- Destination information
- Safety guidelines
- Booking best practices

**Example Query:**
```
"What is the hotel budget policy for corporate travel?"
```

The AI will retrieve the relevant policy from the vector database and provide an accurate answer with sources.

### 2. Short-term Memory
The AI remembers your current conversation:
- Recent messages (configurable, default: 10)
- Current context (destination, budget, preferences)
- Session-based storage

**Example:**
```
You: "I want to travel to Paris"
AI: "Great! How many days are you planning?"
You: "5 days"  ← AI remembers you said Paris
AI: "Perfect! Here's a 5-day itinerary for Paris..."
```

### 3. Long-term Memory
The AI learns your preferences over time:
- Preferred destinations
- Budget ranges
- Travel styles
- Accommodation preferences

**Example:**
After several bookings, the AI learns you prefer:
- Mid-range hotels ($100-200/night)
- Cultural activities
- City destinations

Future recommendations will be personalized to these preferences.

### 4. Real-time Communication
Socket.IO provides instant responses:
- Live typing indicators
- Streaming responses (word-by-word)
- No page refreshes needed
- Automatic reconnection

## 📖 Usage Examples

### Basic Travel Query
```
User: "Plan a 5-day trip to Dubai with a budget of $3000"

AI: [Retrieves destination info from vector DB]
    [Remembers: destination=Dubai, duration=5, budget=3000]
    "I'll help you plan an amazing 5-day trip to Dubai..."
    [Provides itinerary with hotels, activities, flights]
```

### Policy Inquiry
```
User: "Can I book business class for a 2-hour flight?"

AI: [Retrieves corporate policy from vector DB]
    "According to the corporate travel policy, business class 
    is approved for flights over 3 hours..."
```

### Safety Check
```
User: "Is Tokyo safe for solo travelers?"

AI: [Retrieves safety info from vector DB]
    "Tokyo is very safe for solo travelers. Safety score: 9/10..."
```

### Follow-up Questions
```
User: "Show me hotels in London"
AI: "Here are 5 great hotels in London..."

User: "Which one is closest to the city center?"
      ↑ AI remembers we're talking about London hotels
AI: "The Hilton London is in the heart of the city center..."
```

## 🔧 Configuration

### Memory Settings

Adjust in `backend/.env`:

```env
# How many messages to keep in short-term memory
SHORT_TERM_MEMORY_LIMIT=10

# Minimum importance score to save to long-term memory
LONG_TERM_MEMORY_THRESHOLD=5
```

### RAG Settings

Modify in `ragService.generateResponse()` call:

```javascript
const result = await ragService.generateResponse(query, history, {
  topK: 5,                    // Number of relevant documents to retrieve
  temperature: 0.7,           // AI creativity (0-1)
  maxTokens: 1000,            // Max response length
  filter: {                   // Filter by document type
    type: { $in: ['policy', 'destination'] }
  }
});
```

### Socket.IO Settings

Modify in `backend/src/app/server.js`:

```javascript
const io = new Server(httpServer, {
  cors: { origin: config.corsOrigin },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});
```

## 📊 Monitoring

### Check Socket Connections

Backend logs will show:
```
✅ Client connected: John Doe (abc123)
❌ Client disconnected: John Doe (abc123)
```

### Check Memory Usage

```javascript
// In backend console
import { shortTermMemory } from './src/services/memory.service.js';
console.log(shortTermMemory.sessions.size); // Number of active sessions
```

### Check RAG Performance

```javascript
// Test retrieval
const docs = await ragService.retrieve('budget policy', { topK: 3 });
console.log(docs); // See retrieved documents and scores
```

## 🐛 Troubleshooting

### "Socket not connected" Error

**Solution:**
1. Check backend is running
2. Verify CORS_ORIGIN includes frontend URL
3. Check JWT token is valid

### "Pinecone index not found" Error

**Solution:**
1. Wait 1-2 minutes for index creation
2. Run `node initializeKnowledgeBase.js` again
3. Check PINECONE_API_KEY is correct

### "OpenAI API error" Error

**Solution:**
1. Verify OPENAI_API_KEY is correct
2. Check API usage limits on OpenAI dashboard
3. Ensure you have GPT-4 access if using GPT-4

### No AI responses

**Solution:**
1. Check backend logs for errors
2. Verify all environment variables are set
3. Test with `curl`:
```bash
curl -X POST http://localhost:5000/api/copilot/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "Hello"}'
```

## 📈 Next Steps

### Add Custom Knowledge

```javascript
import { ragService } from './src/services/rag.service.js';

await ragService.storeDocument({
  title: 'New Travel Policy',
  content: 'Your policy text here...',
  type: 'policy',
  category: 'corporate',
});
```

### Customize System Prompt

Edit in `backend/src/services/rag.service.js`:

```javascript
const systemPrompt = `You are a helpful travel assistant...
[Add your custom instructions here]`;
```

### Add More Destinations

```javascript
await ragService.storeDocument({
  title: 'Barcelona Travel Guide',
  content: 'Barcelona is a vibrant city in Spain...',
  type: 'destination',
  category: 'europe',
});
```

## 💡 Tips

1. **Start Simple:** Test with basic queries first
2. **Monitor Costs:** Check OpenAI usage dashboard regularly
3. **Customize Prompts:** Adjust system prompts for your use case
4. **Add Knowledge:** Keep vector DB updated with latest info
5. **Test Memories:** Verify short-term and long-term memory work
6. **Use Sources:** Check which documents informed responses

## 📚 Additional Resources

- [Full Implementation Guide](./AI_COPILOT_IMPLEMENTATION.md)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Pinecone Docs](https://docs.pinecone.io/)
- [Socket.IO Docs](https://socket.io/docs/)

## 🆘 Support

If you encounter issues:

1. Check the logs (backend console)
2. Review environment variables
3. Test API keys separately
4. Refer to [AI_COPILOT_IMPLEMENTATION.md](./AI_COPILOT_IMPLEMENTATION.md) for detailed troubleshooting

---

**Happy Building! 🚀**
