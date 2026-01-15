import fs from "fs";
import path from "path";
import { Optional } from "../types/optional.type";

export class PromptUtilities {
  public static load(
    name: string,
    variables: Record<string, Optional<string>>,
  ): string {
    let prompt = fs.readFileSync(
      path.join(process.cwd(), "prompts", name),
      "utf-8",
    );

    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replaceAll(`{{${key}}}`, value ?? "");
    }

    return prompt;
  }
}
