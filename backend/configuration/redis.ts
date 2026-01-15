import { ENVIRONMENT } from "./environment";
import Redis from "ioredis";

export class RedisClient {
  private static instance: Redis | null = null;
  private static ttl: number = 300; // 5 minutes as a default TTL

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: ENVIRONMENT.REDIS_HOST,
        port: ENVIRONMENT.REDIS_PORT,
      });
    }
    return RedisClient.instance;
  }

  public static setTTL(ttl: number): void {
    this.ttl = ttl;
  }

  public static async ping(): Promise<void> {
    const client = RedisClient.getInstance();
    await client.ping();
    console.log("Connected to Redis successfully");
  }

  public static async set(key: string, value: object): Promise<void> {
    const client = RedisClient.getInstance();
    await client.set(key, JSON.stringify(value));
    await client.expire(key, this.ttl);
  }

  public static async setValueIfKeyExists(
    key: string,
    value: object,
  ): Promise<void> {
    const client = RedisClient.getInstance();
    if (await client.exists(key)) {
      await client.set(key, JSON.stringify(value));
      await client.expire(key, this.ttl);
    }
  }

  public static async get<T>(key: string): Promise<T | null> {
    const client = RedisClient.getInstance();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }
}
