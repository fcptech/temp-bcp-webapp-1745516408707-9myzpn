import express from 'express';
import rateLimit from 'express-rate-limit';
import WidgetService from '../services/widget.service.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Rate limiting for token generation
const tokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Validate widget token
router.post('/validate', async (req, res) => {
  try {
    const { token } = req.body;
    const origin = req.headers.origin;

    if (!token || !origin) {
      return res.status(400).json({
        error: 'Missing token or origin'
      });
    }

    const result = await WidgetService.validateToken(token, origin);
    res.json(result);
  } catch (error) {
    logger.error('Widget token validation failed:', error);
    res.status(401).json({
      error: 'Invalid token'
    });
  }
});

// Generate widget token
router.post('/token', tokenLimiter, async (req, res) => {
  try {
    const { clientId, permissions } = req.body;
    const origin = req.headers.origin;

    if (!clientId || !origin) {
      return res.status(400).json({
        error: 'Missing clientId or origin'
      });
    }

    const result = await WidgetService.generateToken(clientId, origin, permissions);
    res.json(result);
  } catch (error) {
    logger.error('Widget token generation failed:', error);
    res.status(401).json({
      error: 'Token generation failed'
    });
  }
});

// Validate domain
router.get('/domains/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const { clientId } = req.query;

    if (!domain || !clientId) {
      return res.status(400).json({
        error: 'Missing domain or clientId'
      });
    }

    const isValid = await WidgetService.validateDomain(domain, clientId);
    res.json({ isValid });
  } catch (error) {
    logger.error('Domain validation failed:', error);
    res.status(500).json({
      error: 'Domain validation failed'
    });
  }
});

export { router as widgetRouter };