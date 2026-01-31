/**
 * Role-based authorization middleware
 * Ensures users have appropriate role permissions
 */

/**
 * Middleware to check if user is an AGENT
 */
export const requireAgent = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (req.user.role !== 'AGENT') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Agent role required.',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization error.',
      error: error.message,
    });
  }
};

/**
 * Middleware to check if user is a CLIENT
 */
export const requireClient = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Client role required.',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization error.',
      error: error.message,
    });
  }
};

/**
 * Middleware to check if user has one of the allowed roles
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. One of the following roles required: ${roles.join(', ')}`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Authorization error.',
        error: error.message,
      });
    }
  };
};
