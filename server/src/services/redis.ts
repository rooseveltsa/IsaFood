import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const KEY_PREFIX = 'isafood:conv:';
const DEFAULT_TTL = 1800; // 30 minutes

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 5) {
          console.error('Redis: max retries reached, giving up');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });

    redis.on('connect', () => {
      console.log('Redis connected');
    });
  }

  return redis;
}

export interface ConversationState {
  state: string;
  data: Record<string, unknown>;
  updatedAt: string;
}

export async function getConversationState(phone: string): Promise<ConversationState | null> {
  try {
    const client = getRedisClient();
    const raw = await client.get(`${KEY_PREFIX}${phone}`);

    if (!raw) return null;

    return JSON.parse(raw) as ConversationState;
  } catch (error) {
    console.error(`Redis getConversationState error for ${phone}:`, error);
    return null;
  }
}

export async function setConversationState(
  phone: string,
  state: string,
  data: Record<string, unknown> = {},
  ttl: number = DEFAULT_TTL,
): Promise<void> {
  try {
    const client = getRedisClient();
    const payload: ConversationState = {
      state,
      data,
      updatedAt: new Date().toISOString(),
    };

    await client.set(`${KEY_PREFIX}${phone}`, JSON.stringify(payload), 'EX', ttl);
  } catch (error) {
    console.error(`Redis setConversationState error for ${phone}:`, error);
  }
}

export async function deleteConversationState(phone: string): Promise<void> {
  try {
    const client = getRedisClient();
    await client.del(`${KEY_PREFIX}${phone}`);
  } catch (error) {
    console.error(`Redis deleteConversationState error for ${phone}:`, error);
  }
}
