const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const { swaggerSpec } = require('./docs/swagger');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

const limiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGO_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

app.get('/health', (_req, res) => {
  const dbState = MONGO_STATES[mongoose.connection.readyState] || 'unknown';
  const dbOk = mongoose.connection.readyState === 1;
  res.status(dbOk ? 200 : 503).json({
    success: dbOk,
    status: dbOk ? 'ok' : 'degraded',
    db: dbState,
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
