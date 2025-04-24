import WidgetService from '../services/widget.service.js';
import { logger } from '../utils/logger.js';

export const validateWidgetToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const origin = req.headers.origin;

    if (!token || !origin) {
      return res.status(401).json({
        error: 'Missing token or origin'
      });
    }

    const result = await WidgetService.validateToken(token, origin);
    if (!result.valid) {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    // Add widget context to request
    req.widget = {
      clientId: result.clientId,
      permissions: result.permissions
    };

    next();
  } catch (error) {
    logger.error('Widget authentication failed:', error);
    res.status(401).json({
      error: 'Authentication failed'
    });
  }
};