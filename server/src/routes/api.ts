import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { sendText } from '../services/evolution.js';
import { checkConnection } from '../services/evolution.js';
import { getActiveConversations } from '../services/supabase.js';

interface SendMessageBody {
  phone: string;
  message: string;
}

interface SendCampaignBody {
  phones: string[];
  message: string;
  imageUrl?: string;
}

export async function apiRoutes(app: FastifyInstance) {
  // Send a message to a specific phone (human handoff reply from admin)
  app.post(
    '/send-message',
    async (request: FastifyRequest<{ Body: SendMessageBody }>, reply: FastifyReply) => {
      const { phone, message } = request.body;

      if (!phone || !message) {
        return reply.status(400).send({ error: 'phone and message are required' });
      }

      try {
        await sendText(phone, message);
        return reply.send({ success: true, phone });
      } catch (error) {
        app.log.error({ error, phone }, 'Failed to send message');
        return reply.status(500).send({ error: 'Failed to send message' });
      }
    },
  );

  // Start a campaign (batch send)
  app.post(
    '/send-campaign',
    async (request: FastifyRequest<{ Body: SendCampaignBody }>, reply: FastifyReply) => {
      const { phones, message } = request.body;

      if (!phones?.length || !message) {
        return reply.status(400).send({ error: 'phones array and message are required' });
      }

      // Return immediately, process in background
      reply.send({ success: true, total: phones.length, status: 'queued' });

      let sent = 0;
      let failed = 0;

      for (const phone of phones) {
        try {
          await sendText(phone, message);
          sent++;
          // Small delay between messages to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (error) {
          app.log.error({ error, phone }, 'Campaign message failed');
          failed++;
        }
      }

      app.log.info({ sent, failed, total: phones.length }, 'Campaign completed');
    },
  );

  // List active conversations
  app.get('/conversations', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const conversations = await getActiveConversations();
      return reply.send({ conversations });
    } catch (error) {
      app.log.error({ error }, 'Failed to fetch conversations');
      return reply.status(500).send({ error: 'Failed to fetch conversations' });
    }
  });

  // Check Evolution API connection status
  app.get('/connection-status', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = await checkConnection();
      return reply.send(status);
    } catch (error) {
      app.log.error({ error }, 'Failed to check connection');
      return reply.status(500).send({ error: 'Failed to check connection status' });
    }
  });
}
