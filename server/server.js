import app from './src/app.js';
import { config } from './src/config/env.js';
import prisma from './src/config/database.js';

const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

let server;

const startServer = async () => {
  try {
    // Start server
    server = app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════╗
║     CareerBridge API Server           ║
╠═══════════════════════════════════════╣
║ Environment: ${NODE_ENV.toUpperCase().padEnd(24)}║
║ Port:        ${PORT.toString().padEnd(24)}║
║ Status:      Running ✓                ║
╚═══════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n✓ Received shutdown signal');
  
  if (server) {
    server.close(async () => {
      console.log('✓ HTTP server closed');
      await prisma.$disconnect();
      console.log('✓ Database connection closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start server
startServer();
