const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/db');
const { seedDefaultAdmin } = require('./services/auth.service');

const startServer = async () => {
  try {
    await connectDatabase();
    await seedDefaultAdmin();

    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`);
      console.log(`Admin account: ${env.adminEmail}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
