import { BasicExecutiveOutputProjector } from "@/lib/executive/output";
import type { ClarificationRequest } from "@/lib/executive/clarification";
import type { Suggestion } from "@/lib/executive/suggestion";

const suggestionCreatedAt = new Date("2026-07-09T14:00:00.000Z");
const clarificationCreatedAt = new Date("2026-07-09T14:05:00.000Z");

const suggestions: Suggestion[] = [
  {
    id: "suggestion:1:contact-insurance",
    title: "Contact insurance",
    whyItMatters:
      "Jess is affected, and the insurance responsibility remains unresolved.",
    suggestedNextStep:
      "Contact insurance and update Jess with the outcome.",
    evidence: [
      {
        id: "evidence:insurance",
        label: "Executive situation: Insurance responsibility affecting Jess",
        summary:
          "Jess appears affected by an unresolved insurance responsibility.",
        confidence: 0.86,
        source: "execution:test",
      },
    ],
    confidence: 0.84,
    status: "pending",
    createdAt: suggestionCreatedAt,
  },
];

const clarifications: ClarificationRequest[] = [
  {
    id: "clarification:1:is-this-something-you-already-committed",
    question:
      "Is this something you already committed to helping with?",
    whyForgeIsAsking:
      "Whether you already committed materially changes what Forge should suggest.",
    uncertainty:
      "Forge does not know whether Maxx is depending on a prior commitment.",
    evidence: [
      {
        id: "evidence:maxx-request",
        label: "Request from Maxx",
        summary:
          "Maxx appears to be asking the operator for help with a project.",
        confidence: 0.78,
        source: "execution:test",
      },
    ],
    situations: [
      {
        id: "situation:maxx-project",
        title: "Maxx asked for project help",
        summary:
          "Maxx has asked for help with a project, but commitment and timing are unclear.",
        evidenceIds: ["evidence:maxx-request"],
        confidence: 0.78,
      },
    ],
    answerChoices: [
      {
        id: "yes-promised",
        label: "Yes, I promised to help",
        value: "committed",
      },
    ],
    allowsFreeFormAnswer: true,
    confidence: 0.82,
    status: "pending",
    createdAt: clarificationCreatedAt,
  },
];

const output = new BasicExecutiveOutputProjector().project({
  suggestions,
  clarifications,
});

const explicitGeneratedAt = new Date("2026-07-09T15:00:00.000Z");

const explicitOutput =
  new BasicExecutiveOutputProjector().project({
    suggestions: [],
    clarifications: [],
    generatedAt: explicitGeneratedAt,
  });

const proof = {
  preservesSuggestions:
    output.suggestions[0] === suggestions[0],
  preservesClarifications:
    output.clarifications[0] === clarifications[0],
  suggestionCount:
    output.summary.suggestionCount === 1,
  clarificationCount:
    output.summary.clarificationCount === 1,
  hasActionableSuggestions:
    output.summary.hasActionableSuggestions === true,
  hasPendingClarifications:
    output.summary.hasPendingClarifications === true,
  usesNewestArtifactDate:
    output.generatedAt.getTime() ===
    clarificationCreatedAt.getTime(),
  acceptsExplicitGeneratedAt:
    explicitOutput.generatedAt === explicitGeneratedAt,
  emptyOutputIsQuiet:
    explicitOutput.summary.suggestionCount === 0 &&
    explicitOutput.summary.clarificationCount === 0 &&
    explicitOutput.summary.hasActionableSuggestions === false &&
    explicitOutput.summary.hasPendingClarifications === false,
  noTaskOrAuthorizationLeak:
    !Object.prototype.hasOwnProperty.call(output, "tasks") &&
    !Object.prototype.hasOwnProperty.call(output, "authorizations"),
};

const passed = Object.values(proof).every(Boolean);

if (!passed) {
  console.error("Executive output projection proof failed.");
  console.error(JSON.stringify(proof, null, 2));
  process.exit(1);
}

console.log("Executive output projection proof passed.");
console.log(JSON.stringify(proof, null, 2));
