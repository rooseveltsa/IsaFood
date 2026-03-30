import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { webhookRoutes } from './routes/webhook.js';
import { apiRoutes } from './routes/api.js';

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

async function main() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
  });

  await app.register(webhookRoutes, { prefix: '/webhook' });
  await app.register(apiRoutes, { prefix: '/api' });

  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  await app.listen({ port: PORT, host: HOST });
  app.log.info(`IsaFood WhatsApp server running on ${HOST}:${PORT}`);

  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down gracefully...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
