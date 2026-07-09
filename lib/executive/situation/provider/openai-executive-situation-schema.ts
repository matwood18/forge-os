import { z } from "zod";

export const OpenAIExecutiveSituationCandidateSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)),
  confidence: z.number().min(0).max(1),
});

export const OpenAIExecutiveSituationResultSchema = z.object({
  situations: z.array(OpenAIExecutiveSituationCandidateSchema),
});

export type OpenAIExecutiveSituationResult = z.infer<
  typeof OpenAIExecutiveSituationResultSchema
>;
