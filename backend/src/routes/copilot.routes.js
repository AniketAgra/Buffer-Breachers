import express from 'express';
import { processQuery, getConversationHistory, submitFeedback } from '../controllers/copilot.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { copilotQuerySchema } from '../validators/copilot.validator.js';

const router = express.Router();

// All copilot routes require authentication
router.post('/query', authenticate, validate(copilotQuerySchema), processQuery);
router.get('/history', authenticate, getConversationHistory);
router.post('/feedback', authenticate, submitFeedback);

export default router;
