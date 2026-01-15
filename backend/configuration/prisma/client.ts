import { PrismaClient as Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { ENVIRONMENT } from "../environment";

export class PrismaClient {
  private static instance: Prisma | null = null;

  public static getInstance(): Prisma {
    if (!PrismaClient.instance) {
      const adapter = new PrismaPg({
        connectionString: ENVIRONMENT.SUPABASE_CONNECTION_STRING,
      });
      PrismaClient.instance = new Prisma({ adapter });
    }
    return PrismaClient.instance;
  }

  public static async ping(): Promise<void> {
    const client = PrismaClient.getInstance();
    await client.$queryRaw`SELECT 1`;
    console.log("Connected to the database successfully");
  }
}

export default PrismaClient;
