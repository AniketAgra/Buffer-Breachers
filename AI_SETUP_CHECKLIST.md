# AI Copilot Setup Checklist

Use this checklist to ensure everything is configured correctly.

## ✅ Prerequisites


- [ ] Node.js installed (v16 or higher)
- [ ] MongoDB running (local or cloud)
- [ ] Git repository cloned
- [ ] Dependencies installed (`npm install` in backend and frontend)

## ✅ API Keys

- [ ] OpenAI API key obtained from https://platform.openai.com/
- [ ] Pinecone API key obtained from https://www.pinecone.io/
- [ ] Both keys added to `backend/.env` file

## ✅ Environment Configuration

- [ ] Copied `backend/.env.example` to `backend/.env`
- [ ] Set `OPENAI_API_KEY` in `.env`
- [ ] Set `PINECONE_API_KEY` in `.env`
- [ ] Set `PINECONE_INDEX_NAME` in `.env` (default: `travel-copilot`)
- [ ] Set `MONGODB_URI` in `.env` (default: `mongodb://localhost:27017/tbo-travel-copilot`)
- [ ] Set `JWT_SECRET` to a secure random string
- [ ] Set `CORS_ORIGIN` to frontend URL (default: `http://localhost:5173`)

## ✅ Knowledge Base Initialization

- [ ] Run `cd backend && npm run init-kb`
- [ ] Wait for "Knowledge Base Initialization Complete!" message
- [ ] Verify no errors in console output
- [ ] Check Pinecone dashboard shows index created

## ✅ Server Startup

- [ ] Backend starts without errors: `cd backend && npm run dev`
- [ ] See "✅ Pinecone initialized successfully"
- [ ] See "✅ OpenAI initialized successfully"
- [ ] See "🔌 Socket.IO enabled"
- [ ] Server running on port 5000 (or configured port)

## ✅ Frontend Startup

- [ ] Frontend starts without errors: `cd frontend && npm run dev`
- [ ] Can access app at http://localhost:5173
- [ ] No console errors in browser

## ✅ Authentication

- [ ] Can register new user
- [ ] Can login successfully
- [ ] JWT token stored in localStorage/cookies
- [ ] Auth context working

## ✅ Socket.IO Connection

- [ ] Open browser console (F12)
- [ ] Navigate to AI Copilot page
- [ ] See "✅ Socket connected" in console
- [ ] Backend logs show "✅ Client connected: [username]"
- [ ] No connection errors

## ✅ AI Copilot Functionality

- [ ] Can send message in chat
- [ ] See typing indicator
- [ ] Receive AI response
- [ ] Response includes relevant information
- [ ] No errors in console

## ✅ RAG Verification

- [ ] Ask: "What is the hotel budget policy?"
- [ ] Response mentions corporate policy details
- [ ] Response includes source information (if visible in UI)
- [ ] Backend logs show RAG retrieval

## ✅ Memory Verification

### Short-term Memory
- [ ] Send message: "I want to go to Paris"
- [ ] Send follow-up: "For 5 days"
- [ ] AI remembers Paris from first message
- [ ] Context maintained across messages

### Long-term Memory
- [ ] Check MongoDB for `conversations` collection
- [ ] Verify conversation saved after interaction
- [ ] Close and reopen browser
- [ ] Start new session
- [ ] Preferences should persist (after multiple uses)

## ✅ Error Handling

- [ ] Try sending empty message (should be prevented)
- [ ] Disconnect internet briefly (should show reconnecting)
- [ ] Reconnects automatically when internet restored
- [ ] Error messages display properly

## ✅ Performance

- [ ] Response time < 5 seconds
- [ ] No memory leaks (check Task Manager after 10+ messages)
- [ ] Socket reconnection works
- [ ] Multiple tabs work simultaneously

## 🔧 Troubleshooting Guide

### Issue: Socket not connecting
**Check:**
- Backend running?
- CORS_ORIGIN set correctly?
- JWT token valid?
- Port 5000 not blocked?

### Issue: No AI responses
**Check:**
- OpenAI API key valid?
- API key has credits?
- Check backend logs for errors
- Test OpenAI separately

### Issue: "Pinecone index not found"
**Check:**
- Pinecone API key valid?
- Ran `npm run init-kb`?
- Wait 1-2 minutes for index creation
- Check Pinecone dashboard

### Issue: "MongoDB connection failed"
**Check:**
- MongoDB running? (`mongod` or MongoDB Compass)
- MONGODB_URI correct?
- Network/firewall not blocking?
- MongoDB Atlas IP whitelist?

### Issue: Out of memory
**Check:**
- Reduce SHORT_TERM_MEMORY_LIMIT
- Archive old conversations
- Check for memory leaks
- Restart backend

## 📊 Verification Commands

### Test Socket.IO
```bash
# In browser console
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});
socket.on('connect', () => console.log('Connected!'));
```

### Test RAG
```bash
curl http://localhost:5000/api/copilot/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What is the budget policy?"}'
```

### Test Memory
```bash
# Check MongoDB
mongosh
use tbo-travel-copilot
db.conversations.find().pretty()
```

## ✅ Production Readiness

- [ ] All API keys in environment variables (not hardcoded)
- [ ] JWT_SECRET is strong random string
- [ ] CORS_ORIGIN restricted to actual domain
- [ ] MongoDB secured with authentication
- [ ] HTTPS enabled for production
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] Monitoring set up

## 📝 Notes

**Important:**
- Keep API keys secret
- Monitor usage to avoid surprise bills
- Back up MongoDB regularly
- Archive old conversations
- Update knowledge base periodically

**Cost Monitoring:**
- OpenAI: https://platform.openai.com/usage
- Pinecone: Dashboard > Usage
- Set up billing alerts

**Resources:**
- Quick Start: [AI_COPILOT_QUICKSTART.md](./AI_COPILOT_QUICKSTART.md)
- Full Guide: [AI_COPILOT_IMPLEMENTATION.md](./AI_COPILOT_IMPLEMENTATION.md)
- Summary: [AI_IMPLEMENTATION_SUMMARY.md](./AI_IMPLEMENTATION_SUMMARY.md)

---

## ✨ Success!

If all items are checked, your AI Copilot is fully operational! 🎉

Next steps:
1. Customize system prompts
2. Add more knowledge to vector DB
3. Adjust memory settings
4. Monitor performance and costs
5. Gather user feedback

**Happy Building!** 🚀
