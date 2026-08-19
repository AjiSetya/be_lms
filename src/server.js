import app from './app.js';
import { env } from './config/env.js';
import { testConnection } from './config/database.js';

const startServer = async () => {
  // Test database connection
  const isDbConnected = await testConnection();

  if (!isDbConnected) {
    console.error('Failed to connect to the database. Server is starting anyway but might not function correctly.');
  }

  app.listen(env.port, () => {
    console.log(`[Server] LMS API is running on http://localhost:${env.port} in ${env.nodeEnv} mode`);
  });
};

startServer();
