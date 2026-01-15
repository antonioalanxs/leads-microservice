import { ENVIRONMENT } from "./configuration/environment";
import { app } from "./app";
import { SupabaseClient } from "./configuration/supabase";
import { PrismaClient } from "./configuration/prisma/client";
import { RedisClient } from "./configuration/redis";

async function startServer() {
  try {
    await SupabaseClient.ping();
    await PrismaClient.ping();
    await RedisClient.ping();
    app.listen(ENVIRONMENT.PORT, () => {
      console.log(`Server running on port ${ENVIRONMENT.PORT}`);
    });
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
