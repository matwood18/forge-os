import type { Question } from "@/lib/domain";
import type { IdentityEvidence } from "./types";

export function createIdentityResolutionQuestion(
  evidence: IdentityEvidence[]
): Question {
  return {
    id: crypto.randomUUID(),
    type: "identity-resolution",
    prompt: buildIdentityPrompt(evidence),
    status: "open",
    impact: 50,
    createdAt: new Date(),
  };
}

function buildIdentityPrompt(evidence: IdentityEvidence[]): string {
  const values = evidence.map((item) => item.value).join(", ");

  return `Who is this contact? ${values}`;
}