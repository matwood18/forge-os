import {
  BasicExecutivePresentationProjector,
} from "@/lib/executive";
import type { Suggestion } from "@/lib/executive";

const createdAt = new Date("2026-07-09T12:00:00.000Z");

const suggestions: Suggestion[] = [
  {
    id: "suggestion:1",
    title: "Concerns about contacting insurance and its impact on a relationship",
    whyItMatters:
      "Jess is mad at the person for not contacting the insurance, indicating a potential relationship strain due to this unresolved obligation. The situation reflects repeated failure to address this task (evidence: openai-situation:3).",
    suggestedNextStep:
      "Review this situation and decide whether it needs attention today.",
    evidence: [
      {
        id: "openai-situation:3",
        label: "Executive situation: insurance",
        summary:
          "Jess is affected by the unresolved insurance issue.",
        confidence: 0.9,
        source: "test",
      },
    ],
    confidence: 0.9,
    status: "pending",
    createdAt,
  },
  {
    id: "suggestion:2",
    title: "Call the dentist before Friday",
    whyItMatters:
      "The obligation to call the dentist is time-sensitive, needing to be completed before Friday (evidence: openai-situation:2).",
    suggestedNextStep:
      "Schedule time to call the dentist before the deadline.",
    evidence: [
      {
        id: "openai-situation:2",
        label: "Executive situation: dentist",
        summary:
          "The dentist needs to be called before Friday.",
        confidence: 0.88,
        source: "test",
      },
    ],
    confidence: 0.88,
    status: "pending",
    createdAt,
  },
];

const projected =
  new BasicExecutivePresentationProjector().project({
    suggestions,
  });

const visibleText = projected
  .flatMap((suggestion) => [
    suggestion.title,
    suggestion.whyItMatters,
    suggestion.suggestedNextStep,
  ])
  .join(" ")
  .toLowerCase();

const forbiddenTerms = [
  "semantic",
  "evidence",
  "claim",
  "reasoning",
  "runtime",
  "projection",
  "situation",
  "confidence",
  "artifact",
];

const proof = {
  countPreserved: projected.length === suggestions.length,
  evidencePreserved: projected.every(
    (suggestion, index) =>
      suggestion.evidence.length === suggestions[index].evidence.length
  ),
  statusPreserved: projected.every(
    (suggestion) => suggestion.status === "pending"
  ),
  datesPreserved: projected.every(
    (suggestion) => suggestion.createdAt === createdAt
  ),
  insuranceTitleActionable:
    projected[0].title === "Contact insurance",
  insuranceWhyPlain:
    projected[0].whyItMatters ===
    "Jess appears affected by this remaining unresolved.",
  insuranceNextStepConcrete:
    projected[0].suggestedNextStep === "Contact insurance today.",
  dentistTitleActionable:
    projected[1].title === "Call the dentist",
  dentistWhyPlain:
    projected[1].whyItMatters ===
    "This needs attention before Friday.",
  noForbiddenVisibleLanguage:
    !forbiddenTerms.some((term) => visibleText.includes(term)),
  noEvidenceIdsVisible:
    !visibleText.includes("openai-situation"),
};

const passed = Object.values(proof).every(Boolean);

if (!passed) {
  console.error("Executive presentation proof failed.");
  console.error(JSON.stringify(proof, null, 2));
  process.exit(1);
}

console.log("Executive presentation proof passed.");
console.log(JSON.stringify(proof, null, 2));
