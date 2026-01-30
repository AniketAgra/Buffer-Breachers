import { asyncHandler } from '../middlewares/error.middleware.js';
import { SafetyAlert } from '../models/SafetyAlert.model.js';
import { getSafetyScore, generateSafetyReport, getAreaSafetyRatings, checkDemographicSafety } from '../utils/safetyScore.util.js';

/**
 * @desc    Get safety score for destination
 * @route   GET /api/safety/destination/:name
 * @access  Public
 */
export const getDestinationSafety = asyncHandler(async (req, res) => {
  const { name } = req.params;
  
  const context = {
    destination: name,
    travel: { type: 'solo', count: 1 },
    budget: { preference: 'mid-range' },
    duration: 3,
  };
  
  const safety = generateSafetyReport(name, context);
  
  res.status(200).json({
    success: true,
    data: safety,
  });
});

/**
 * @desc    Get active safety alerts for destination
 * @route   GET /api/safety/alerts/:destination
 * @access  Public
 */
export const getActiveAlerts = asyncHandler(async (req, res) => {
  const { destination } = req.params;
  
  const alerts = await SafetyAlert.find({
    destination: new RegExp(destination, 'i'),
    isActive: true,
    $or: [
      { validUntil: { $exists: false } },
      { validUntil: { $gte: new Date() } },
    ],
  }).sort({ severity: -1, createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
});

/**
 * @desc    Report safety concern
 * @route   POST /api/safety/report
 * @access  Private
 */
export const reportSafetyConcern = asyncHandler(async (req, res) => {
  const { destination, alertType, severity, title, message, description } = req.body;
  
  const alert = await SafetyAlert.create({
    destination,
    alertType,
    severity,
    title,
    message,
    description,
    source: 'User Report',
  });
  
  res.status(201).json({
    success: true,
    message: 'Safety concern reported successfully',
    data: alert,
  });
});

/**
 * @desc    Get area-wise safety ratings
 * @route   GET /api/safety/areas/:destination
 * @access  Public
 */
export const getAreaSafety = asyncHandler(async (req, res) => {
  const { destination } = req.params;
  
  const areaSafety = getAreaSafetyRatings(destination);
  
  res.status(200).json({
    success: true,
    data: areaSafety,
  });
});

/**
 * @desc    Check safety for specific demographic
 * @route   GET /api/safety/demographic/:destination/:demographic
 * @access  Public
 */
export const getDemographicSafety = asyncHandler(async (req, res) => {
  const { destination, demographic } = req.params;
  
  const safety = checkDemographicSafety(destination, demographic);
  
  res.status(200).json({
    success: true,
    data: safety,
  });
});
