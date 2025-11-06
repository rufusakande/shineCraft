import dotenv from 'dotenv';
import { httpServer } from './app';
import { testConnection, syncDb } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 4000;
const isDevelopment = process.env.NODE_ENV === 'development';

async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database models
    await syncDb();

    // Start server
    httpServer.listen(PORT, () => {
      if (isDevelopment) {
        console.log(`
🚀 Server is running on port ${PORT}
📝 API Documentation: http://localhost:${PORT}/api-docs
💻 Environment: ${process.env.NODE_ENV}
        `);
      } else {
        console.log('Server started successfully');
      }
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();