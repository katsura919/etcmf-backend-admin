import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { config } from 'dotenv';
import { connectDB } from './libs/db';

// Import route handlers
import authRoutes from './modules/authentication/auth-route';
import adminRoutes from './routes/adminRoutes';
import ticketRoutes from './routes/ticketRoutes';
import violationRoutes from './routes/violationRoutes';
import penaltyRoutes from './routes/penaltyRoutes';
import municipalRoutes from './routes/municipalRoutes';

// Load environment variables
config();

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: 'info',
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    } : undefined
  }
});

// Declare a route handler for the root path
fastify.get('/', async (request, reply) => {
  return { message: 'ETCMF Admin API Server is running!' };
});

// Register CORS plugin
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
});

// Register route plugins
fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(adminRoutes, { prefix: '/admin' });
fastify.register(ticketRoutes, { prefix: '/ticket' });
fastify.register(violationRoutes, { prefix: '/violations' });
fastify.register(penaltyRoutes, { prefix: '/penalties' });
fastify.register(municipalRoutes, { prefix: '/municipal' });

// Start server function
const start = async (): Promise<void> => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start the server
    await fastify.listen({
      port: PORT,
      host: HOST
    });
    
    fastify.log.info(`Server running on http://${HOST}:${PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const shutdown = async (): Promise<void> => {
  try {
    await fastify.close();
    fastify.log.info('Server shut down gracefully');
  } catch (error) {
    fastify.log.error(`Error during shutdown: ${error}`);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the application
if (require.main === module) {
  start();
}

export default fastify;
export { start, shutdown };
