# AI Copilot Implementation Guide

## Overview

This implementation adds advanced AI capabilities to the Travel Copilot system:

- **RAG (Retrieval-Augmented Generation)** using Pinecone vector database
- **Short-term Memory** for session-based conversation context
- **Long-term Memory** for persistent user preferences and history
- **Real-time Communication** via Socket.IO for streaming responses

## Architecture

### Backend Components

#### 1. Configuration Files
- `config/openai.js` - OpenAI API client initialization and utilities
- `config/pinecone.js` - Pinecone vector database connection
- `config/env.js` - Enhanced with AI service configuration

#### 2. Services

##### Memory Service (`services/memory.service.js`)
Manages both short-term and long-term memory:

**Short-term Memory:**
- In-memory session storage
- Stores recent conversation (configurable limit)
- Fast access for real-time interactions
- Auto-cleanup of old sessions

**Long-term Memory:**
- MongoDB-backed persistent storage
- User preferences and patterns
- Conversation history and context
- Importance-based archival

**Memory Manager:**
- Unified interface for both memory types
- Session initialization and management
- Automatic persistence
- Historical context retrieval

##### RAG Service (`services/rag.service.js`)
Implements Retrieval-Augmented Generation:

**Features:**
- Store documents in Pinecone vector database
- Generate embeddings using OpenAI
- Semantic search for relevant context
- Response augmentation with retrieved knowledge
- Pre-loaded travel knowledge base

**Knowledge Base:**
- Corporate travel policies
- Destination information
- Safety guidelines
- Booking best practices

#### 3. Models

##### Conversation Model (`models/Conversation.model.js`)
Stores conversation data for long-term memory:
- User and session identification
- Message history with metadata
- Context and importance scoring
- Last accessed timestamp for cleanup

#### 4. Socket.IO Integration

##### Socket Handlers (`app/socketHandlers.js`)
Real-time communication handlers:

**Events:**
- `session:init` - Initialize or resume conversation
- `copilot:query` - Send query and get response
- `copilot:stream` - Streaming responses
- `copilot:typing` - Typing indicators
- `copilot:response` - Complete response
- `copilot:error` - Error handling
- `copilot:history` - Get conversation history
- `session:clear` - Clear current session
- `user:preferences` - Get user preferences
- `copilot:feedback` - Submit feedback

**Features:**
- JWT-based authentication
- User-specific rooms
- Real-time typing indicators
- Error handling and recovery
- Automatic memory persistence

#### 5. Updated Controller

##### Copilot Controller (`controllers/copilot.controller.js`)
Enhanced with RAG and memory:
- Memory manager integration
- RAG-enhanced responses
- Session tracking
- Context persistence

### Frontend Components

#### Socket Service (`services/socket.js`)
Client-side Socket.IO management:

**Features:**
- Automatic connection management
- Session initialization
- Event listeners
- Query sending (standard and streaming)
- History and preferences retrieval
- Feedback submission
- Reconnection handling

#### Updated AgentCopilot Component
Enhanced with real-time features:
- Socket.IO connection on mount
- Real-time message handling
- Typing indicators
- Session persistence
- Fallback to HTTP if socket unavailable

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` in the backend directory and configure:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-key-here

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-key-here
PINECONE_ENVIRONMENT=gcp-starter
PINECONE_INDEX_NAME=travel-copilot
```

### 2. Get API Keys

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy and add to `.env`

#### Pinecone API Key
1. Visit [Pinecone](https://www.pinecone.io/)
2. Sign up for free account
3. Create new project
4. Get API key from dashboard
5. Copy and add to `.env`

### 3. Initialize Services

The services initialize automatically on server start:

```javascript
// In server.js
await initializePinecone();  // Creates index if needed
initializeOpenAI();           // Connects to OpenAI
```

### 4. Seed Knowledge Base (Optional)

To populate the vector database with initial travel knowledge:

```javascript
import { ragService, initializeKnowledgeBase } from './services/rag.service.js';

// After Pinecone initialization
await initializeKnowledgeBase(ragService);
```

This is automatically done on first run if the index is empty.

## Usage Examples

### Backend: Using Memory Manager

```javascript
import { MemoryManager } from './services/memory.service.js';

// Initialize
const memoryManager = new MemoryManager(userId);
const sessionId = await memoryManager.initializeSession();

// Add messages
memoryManager.addMessage('user', 'Show me hotels in Paris');
memoryManager.addMessage('assistant', 'Here are the best hotels...');

// Update context
memoryManager.updateContext({ destination: 'Paris', budget: 5000 });

// Get history
const history = memoryManager.getHistory();

// Persist to long-term memory
await memoryManager.persist(importance=3);

// Get relevant history
const relevantConversations = await memoryManager.getRelevantHistory('Paris hotels');
```

### Backend: Using RAG Service

```javascript
import { ragService } from './services/rag.service.js';

// Store document
await ragService.storeDocument({
  id: 'policy-1',
  title: 'Hotel Budget Policy',
  content: 'Hotels must be under $300 per night...',
  type: 'policy',
  category: 'corporate',
});

// Retrieve relevant documents
const relevantDocs = await ragService.retrieve('What is the hotel budget?', {
  topK: 5,
  filter: { type: 'policy' },
});

// Generate RAG-enhanced response
const result = await ragService.generateResponse(
  'What is the hotel budget?',
  conversationHistory,
  { topK: 5 }
);

console.log(result.response);  // AI response
console.log(result.sources);   // Source documents
```

### Frontend: Using Socket Service

```javascript
import socketService from './services/socket';

// Connect
socketService.connect(authToken);

// Initialize session
const { sessionId } = await socketService.initSession();

// Send query
socketService.sendQuery('Show me hotels in London', sessionId);

// Listen for response
socketService.on('copilot:response', (data) => {
  console.log(data.response);
  console.log(data.sources);  // RAG sources
});

// Listen for typing
socketService.on('copilot:typing', (data) => {
  setIsTyping(data.isTyping);
});

// Handle errors
socketService.on('copilot:error', (data) => {
  console.error(data.error);
});

// Cleanup
socketService.disconnect();
```

## Features & Benefits

### 1. RAG (Retrieval-Augmented Generation)
- **Accurate Responses:** AI uses verified travel knowledge
- **Source Citations:** See which documents informed the response
- **Scalable Knowledge:** Easy to add new policies and info
- **Semantic Search:** Finds relevant info even with different wording

### 2. Short-term Memory
- **Context Awareness:** AI remembers conversation flow
- **Fast Access:** In-memory storage for instant retrieval
- **Session Management:** Multiple concurrent conversations
- **Auto-cleanup:** Removes old sessions automatically

### 3. Long-term Memory
- **User Preferences:** Learns travel preferences over time
- **Pattern Recognition:** Identifies booking patterns
- **Historical Context:** Access past conversations
- **Personalization:** Tailored recommendations

### 4. Real-time Communication
- **Instant Responses:** Socket.IO for zero-delay updates
- **Typing Indicators:** Shows when AI is thinking
- **Streaming Responses:** See responses as they generate
- **Error Recovery:** Automatic reconnection handling

## Performance Considerations

### Pinecone Index
- Use serverless for cost-effective starting
- Upgrade to pod-based for high-volume production
- Monitor query latency and adjust replicas

### Memory Management
- Short-term memory cleanup runs every 30 minutes
- Configure `SHORT_TERM_MEMORY_LIMIT` based on conversation length
- Archive old long-term conversations periodically

### Socket.IO
- WebSocket preferred for lower latency
- Polling fallback for restricted networks
- Consider load balancing for multiple instances

## Testing

### Test Socket Connection

```javascript
// In browser console
const socket = io('http://localhost:5000', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('session:init', {}, (response) => {
    console.log('Session:', response.sessionId);
  });
});
```

### Test RAG Service

```javascript
// Create test endpoint
app.get('/test/rag', async (req, res) => {
  const result = await ragService.retrieve('safety tips', { topK: 3 });
  res.json(result);
});
```

### Test Memory Service

```javascript
// Create test endpoint
app.get('/test/memory/:userId', async (req, res) => {
  const manager = new MemoryManager(req.params.userId);
  await manager.initializeSession();
  manager.addMessage('user', 'Test message');
  await manager.persist();
  res.json({ history: manager.getHistory() });
});
```

## Troubleshooting

### Socket Connection Issues
- **Check CORS:** Ensure frontend URL in `CORS_ORIGIN`
- **Verify Token:** JWT token must be valid
- **Network:** Check firewall and proxy settings

### Pinecone Errors
- **Index Not Found:** Wait for index creation (takes ~1 minute)
- **Dimension Mismatch:** Ensure using `text-embedding-ada-002` (1536 dimensions)
- **Rate Limits:** Free tier has limits, upgrade if needed

### OpenAI Errors
- **Invalid API Key:** Verify key is correct and active
- **Rate Limits:** Check usage on OpenAI dashboard
- **Model Access:** Ensure GPT-4 access if using that model

### Memory Issues
- **Session Not Found:** Check sessionId is being passed correctly
- **MongoDB Connection:** Verify MongoDB is running
- **Large History:** Adjust `SHORT_TERM_MEMORY_LIMIT` if needed

## Future Enhancements

1. **Streaming Responses:** Implement true OpenAI streaming API
2. **Multi-modal Support:** Add image understanding
3. **Voice Input:** Speech-to-text integration
4. **Advanced RAG:** Implement query rewriting and multi-hop retrieval
5. **Analytics:** Track conversation quality and user satisfaction
6. **A/B Testing:** Test different prompts and models
7. **Caching:** Redis layer for frequently accessed data
8. **Vector Search Optimization:** Fine-tune embedding strategies

## Security Best Practices

1. **API Keys:** Never commit `.env` files
2. **JWT Validation:** Always verify tokens in socket middleware
3. **Rate Limiting:** Implement per-user rate limits
4. **Input Sanitization:** Validate all user inputs
5. **Error Messages:** Don't expose sensitive info in errors
6. **HTTPS Only:** Use secure connections in production
7. **Monitor Usage:** Track API usage and costs

## Cost Optimization

1. **OpenAI:**
   - Use GPT-3.5-turbo for simple queries
   - Cache common responses
   - Limit max_tokens appropriately

2. **Pinecone:**
   - Start with serverless tier
   - Monitor query volume
   - Archive old vectors

3. **MongoDB:**
   - Index frequently queried fields
   - Archive old conversations
   - Use compression

## Support & Resources

- **OpenAI Docs:** https://platform.openai.com/docs
- **Pinecone Docs:** https://docs.pinecone.io/
- **Socket.IO Docs:** https://socket.io/docs/
- **MongoDB Docs:** https://www.mongodb.com/docs/

## License

This implementation is part of the Buffer Breachers Travel Copilot project.
