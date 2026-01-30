/**
 * Validation middleware
 * Uses Zod schemas to validate request data
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body against schema
      const parsed = schema.parse(req.body);
      
      // Replace request body with parsed data (sanitized)
      req.body = parsed;
      
      next();
    } catch (error) {
      // Zod validation error
      if (error.name === 'ZodError') {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors,
        });
      }
      
      // Other errors
      res.status(500).json({
        success: false,
        message: 'Validation middleware error',
        error: error.message,
      });
    }
  };
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Query validation error',
          errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Validation middleware error',
        error: error.message,
      });
    }
  };
};

/**
 * Validate route parameters
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Parameter validation error',
          errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Validation middleware error',
        error: error.message,
      });
    }
  };
};
