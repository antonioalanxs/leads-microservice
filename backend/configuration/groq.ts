import Groq from "groq-sdk";

import { ENVIRONMENT } from "./environment";
import { Optional } from "../types/optional.type";

export class GroqClient {
  private static instance: Groq | null = null;

  public static getInstance(): Groq {
    if (!GroqClient.instance) {
      GroqClient.instance = new Groq({
        apiKey: ENVIRONMENT.GROQ_API_KEY,
      });
    }
    return GroqClient.instance;
  }

  public static async getCompletion(prompt: string): Promise<Optional<string>> {
    const client = GroqClient.getInstance();
    let response = await client.chat.completions.create({
      model: ENVIRONMENT.GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
  }
}
