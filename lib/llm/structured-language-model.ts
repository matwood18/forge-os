import type { ZodSchema } from "zod";

export interface StructuredLanguageModel {
  generate<T>(
    system: string,
    prompt: string,
    schema: ZodSchema<T>
  ): Promise<T>;
}