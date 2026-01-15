import {
  createClient,
  SupabaseClient as Supabase,
} from "@supabase/supabase-js";
import { ENVIRONMENT } from "./environment";

export class SupabaseClient {
  private static instance: Supabase | null = null;

  public static getInstance(): Supabase {
    if (!SupabaseClient.instance) {
      SupabaseClient.instance = createClient(
        ENVIRONMENT.SUPABASE_URI,
        ENVIRONMENT.SUPABASE_KEY,
      );
    }
    return SupabaseClient.instance;
  }

  public static async ping(): Promise<void> {
    const client = SupabaseClient.getInstance();
    const { data, error } = await client.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log("Connected to Supabase successfully");
  }
}
