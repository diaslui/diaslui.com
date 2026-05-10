import { Redis } from "@upstash/redis";

let redisInstance: Redis;

const redis = {
  start: (url: string | undefined, token: string | undefined) => {
    if (!url || !token) {
      return;
    }

    if (!redisInstance) {
      redisInstance = new Redis({
        url,
        token,
      });
    }
  },

  get: async (key: string): Promise<string | null> => {
    if (!redisInstance) {
      return null;
    }
    return await redisInstance.get(key);
  },

  incr: async (key: string): Promise<number | null> => {
    if (!redisInstance) {
      return null;
    }
    return await redisInstance.incr(key);
  },

  set: async (
    key: string,
    value: string,
    opts?: any
  ): Promise<string | null> => {
    if (!redisInstance) {
      return null;
    }
    return await redisInstance.set(key, value, opts);
  },
};

export default redis;
