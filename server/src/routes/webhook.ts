import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { processMessage } from '../services/conversation.js';

interface EvolutionWebhookBody {
  event: string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    pushName?: string;
    message?: {
      conversation?: string;
      extendedTextMessage?: {
        text?: string;
      };
    };
    messageType?: string;
  };
}

export async function webhookRoutes(app: FastifyInstance) {
  app.post(
    '/evolution',
    async (request: FastifyRequest<{ Body: EvolutionWebhookBody }>, reply: FastifyReply) => {
      const body = request.body;

      if (!body || !body.event) {
        return reply.status(400).send({ error: 'Invalid webhook payload' });
      }

      // Return 200 immediately, process async
      reply.status(200).send({ received: true });

      try {
        if (body.event === 'messages.upsert') {
          await handleMessageUpsert(body, app);
        } else if (body.event === 'connection.update') {
          app.log.info({ instance: body.instance, data: body.data }, 'Connection update');
        }
      } catch (error) {
        app.log.error({ error, event: body.event }, 'Error processing webhook event');
      }
    },
  );
}

async function handleMessageUpsert(body: EvolutionWebhookBody, app: FastifyInstance) {
  const { key, pushName, message } = body.data;

  // Skip messages sent by ourselves
  if (key.fromMe) {
    return;
  }

  // Skip group messages
  if (key.remoteJid.includes('@g.us')) {
    return;
  }

  // Extract phone number (remove @s.whatsapp.net)
  const phone = key.remoteJid.replace('@s.whatsapp.net', '');

  // Extract message text
  const text =
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    '';

  if (!text.trim()) {
    app.log.info({ phone }, 'Received non-text message, ignoring');
    return;
  }

  const name = pushName || 'Cliente';

  app.log.info({ phone, text, name }, 'Processing incoming message');

  try {
    await processMessage(phone, text.trim(), name);
  } catch (error) {
    app.log.error({ error, phone, text }, 'Error processing message');
  }
}
