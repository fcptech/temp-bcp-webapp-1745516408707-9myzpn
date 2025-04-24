import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';
import { accountsRouter } from './routes/accounts.js';
import { statementsRouter } from './routes/statements.js';
import { performanceRouter } from './routes/performance.js';
import { widgetRouter } from './routes/widget.js';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Configure CORS to only allow widget embedding from authorized domains
app.use(cors({
  origin: async (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    try {
      // Check if domain is authorized
      const isAuthorized = await validateDomain(origin);
      if (isAuthorized) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } catch (error) {
      callback(error);
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/statements', statementsRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/widget', widgetRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Domain validation helper
async function validateDomain(origin) {
  // For development, allow localhost and netlify.app domains
  if (process.env.NODE_ENV === 'development') {
    return origin.includes('localhost') || origin.includes('netlify.app');
  }

  try {
    // In production, check against authorized domains in database
    const domain = new URL(origin).hostname;
    // TODO: Replace with actual database check
    const authorizedDomains = ['eclectic-unicorn-c4ddde.netlify.app'];
    return authorizedDomains.includes(domain);
  } catch (error) {
    logger.error('Domain validation error:', error);
    return false;
  }
}