const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/db');
const { seedDefaultAdmin } = require('./services/auth.service');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    await connectDatabase();
    await seedDefaultAdmin();

    app.listen(env.port, () => {
      logger.info(`Backend running on http://localhost:${env.port}`);
      logger.info(`Admin account: ${env.adminEmail}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Server startup failed');
    process.exit(1);
  }
};

startServer();
