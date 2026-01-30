import express from 'express';
import {
  searchFlights,
  searchHotels,
  getDestinations,
  getDestinationById,
  searchActivities,
} from '../controllers/travel.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { flightSearchSchema, hotelSearchSchema, activitySearchSchema } from '../validators/travel.validator.js';

const router = express.Router();

// All routes are public
router.post('/flights/search', validate(flightSearchSchema), searchFlights);
router.post('/hotels/search', validate(hotelSearchSchema), searchHotels);
router.post('/activities/search', validate(activitySearchSchema), searchActivities);
router.get('/destinations', getDestinations);
router.get('/destinations/:id', getDestinationById);

export default router;
