import { BasicSuggestionProjector } from "@/lib/executive/suggestion";
import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";

const generatedAt = new Date("2026-07-09T12:00:00.000Z");

const reasoningInput: ExecutiveReasoningInput = {
  input: [
    "Jess is mad at me for not contacting insurance.",
    "I need to call the dentist before Friday.",
  ].join("\n"),
  evidence: [
    {
      id: "evidence:insurance",
      label: "Executive situation: Insurance responsibility affecting Jess",
      summary:
        "Jess appears affected by an unresolved insurance responsibility.",
      confidence: 0.86,
      source: "execution:test",
    },
    {
      id: "evidence:dentist",
      label: "Executive situation: Dentist appointment before Friday",
      summary:
        "The operator may need to call the dentist before Friday.",
      confidence: 0.82,
      source: "execution:test",
    },
  ],
};

const reasoningResult: ExecutiveReasoningResult = {
  provider: "basic",
  generatedAt,
  priorities: [
    {
      title: "Contact insurance",
      rationale:
        "Jess is affected, and the insurance responsibility remains unresolved.",
      suggestedNextStep:
        "Contact insurance and update Jess with the outcome.",
      evidenceIds: ["evidence:insurance"],
      confidence: 0.84,
    },
    {
      title: "Call the dentist",
      rationale:
        "This appears time-sensitive because it needs attention before Friday.",
      suggestedNextStep:
        "Call the dentist and schedule the appointment.",
      evidenceIds: ["evidence:dentist"],
      confidence: 0.8,
    },
  ],
};

const suggestions = new BasicSuggestionProjector().project({
  reasoningInput,
  reasoningResult,
});

const proof = {
  suggestionCount: suggestions.length,
  pendingByDefault: suggestions.every(
    (suggestion) => suggestion.status === "pending"
  ),
  preservesWhyItMatters: suggestions[0]?.whyItMatters ===
    reasoningResult.priorities[0]?.rationale,
  preservesSuggestedNextStep: suggestions[0]?.suggestedNextStep ===
    reasoningResult.priorities[0]?.suggestedNextStep,
  preservesConfidence: suggestions[1]?.confidence ===
    reasoningResult.priorities[1]?.confidence,
  preservesCreatedAt: suggestions.every(
    (suggestion) => suggestion.createdAt === generatedAt
  ),
  preservesEvidenceObjects:
    suggestions[0]?.evidence[0]?.id === "evidence:insurance" &&
    suggestions[0]?.evidence[0]?.summary ===
      "Jess appears affected by an unresolved insurance responsibility.",
  noAutomaticTaskCreation:
    !Object.prototype.hasOwnProperty.call(suggestions[0], "taskId") &&
    !Object.prototype.hasOwnProperty.call(suggestions[0], "authorizationId"),
};

const passed = Object.values(proof).every(Boolean);

if (!passed) {
  console.error("Suggestion projection proof failed.");
  console.error(JSON.stringify(proof, null, 2));
  process.exit(1);
}

console.log("Suggestion projection proof passed.");
console.log(JSON.stringify(proof, null, 2));
