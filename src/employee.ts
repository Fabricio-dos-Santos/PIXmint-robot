import { config } from './config/env';
import app from './app';

// Start server with graceful shutdown
const server = app.listen(config.port, () => {
  console.log(`Employee server listening on port ${config.port}`);
});

function shutdown(): void {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export { app, server };