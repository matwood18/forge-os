import { z } from "zod";

export const OpenAIExecutiveReasonedPrioritySchema = z.object({
  title: z.string().min(1),
  rationale: z.string().min(1),
  suggestedNextStep: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)),
  confidence: z.number().min(0).max(1),
});

export const OpenAIExecutiveReasoningResultSchema = z.object({
  priorities: z.array(OpenAIExecutiveReasonedPrioritySchema),
});

export type OpenAIExecutiveReasoningResult = z.infer<
  typeof OpenAIExecutiveReasoningResultSchema
>;
