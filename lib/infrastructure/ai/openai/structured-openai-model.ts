import OpenAI from "openai";
import type { ZodSchema } from "zod";

import type { StructuredLanguageModel } from "@/lib/llm";

export class StructuredOpenAIModel implements StructuredLanguageModel {
  private readonly client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(private readonly model = "gpt-4o-mini") {}

  async generate<T>(
    system: string,
    prompt: string,
    schema: ZodSchema<T>
  ): Promise<T> {
    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.output_text.trim();
    const json = JSON.parse(text);

    return schema.parse(json);
  }
}
