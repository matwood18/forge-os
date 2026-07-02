import { z } from "zod";

export const ObservationCandidateKindSchema = z.enum([
  "possible-person",
  "possible-organization",
  "possible-location",
  "activity",
  "commitment",
  "follow-up",
  "relationship",
  "business-opportunity",
  "unknown",
]);

export const ObservationCandidateSchema = z.object({
  kind: ObservationCandidateKindSchema,
  value: z.string(),
  confidence: z.number(),
  source: z.string(),
});

export const ObservationCandidateListSchema = z.object({
  observations: z.array(ObservationCandidateSchema),
});

export type ObservationCandidate = z.infer<typeof ObservationCandidateSchema>;

export type ObservationCandidateList = z.infer<
  typeof ObservationCandidateListSchema
>;