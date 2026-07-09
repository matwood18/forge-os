import { BasicClarificationProjector } from "@/lib/executive/clarification";
import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";
import type {
  ExecutiveSituationInput,
  ExecutiveSituationResult,
} from "@/lib/executive/situation";

const generatedAt = new Date("2026-07-09T13:00:00.000Z");

const situationInput: ExecutiveSituationInput = {
  sourceText:
    "Maxx asked me to help with his project again.",
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
};

const situationResult: ExecutiveSituationResult = {
  generatedAt,
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
};

const reasoningInput: ExecutiveReasoningInput = {
  input: situationInput.sourceText,
  evidence: [
    {
      id: "situation:maxx-project",
      label: "Executive situation: Maxx asked for project help",
      summary:
        "Maxx has asked for help with a project, but commitment and timing are unclear.",
      confidence: 0.78,
      source: "execution:test",
    },
  ],
};

const reasoningResult: ExecutiveReasoningResult = {
  provider: "basic",
  generatedAt,
  priorities: [],
};

const clarifications = new BasicClarificationProjector().project({
  situationInput,
  situationResult,
  reasoningInput,
  reasoningResult,
  candidates: [
    {
      question:
        "Is this something you already committed to helping with?",
      whyForgeIsAsking:
        "Whether you already committed materially changes whether this should become a responsibility, a conversation, or something to dismiss.",
      uncertainty:
        "Forge does not know whether Maxx is depending on a prior commitment.",
      evidenceIds: ["evidence:maxx-request"],
      situationIds: ["situation:maxx-project"],
      answerChoices: [
        {
          id: "yes-promised",
          label: "Yes, I promised to help",
          value: "committed",
        },
        {
          id: "no-not-committed",
          label: "No, I haven't committed",
          value: "not_committed",
        },
        {
          id: "not-sure",
          label: "Not sure",
          value: "uncertain",
        },
      ],
      allowsFreeFormAnswer: true,
      confidence: 0.82,
    },
    {
      question:
        "This invalid clarification should be rejected.",
      whyForgeIsAsking:
        "It references evidence Forge did not supply.",
      uncertainty:
        "Unsupported uncertainty.",
      evidenceIds: ["invented:evidence"],
      situationIds: ["situation:maxx-project"],
      allowsFreeFormAnswer: false,
      confidence: 0.9,
    },
  ],
});

const proof = {
  clarificationCount: clarifications.length,
  pendingByDefault: clarifications.every(
    (clarification) => clarification.status === "pending"
  ),
  preservesQuestion:
    clarifications[0]?.question ===
    "Is this something you already committed to helping with?",
  preservesWhyForgeIsAsking:
    clarifications[0]?.whyForgeIsAsking.includes(
      "materially changes"
    ) ?? false,
  preservesUncertainty:
    clarifications[0]?.uncertainty.includes(
      "prior commitment"
    ) ?? false,
  preservesEvidenceReferences:
    clarifications[0]?.evidence[0]?.id === "evidence:maxx-request",
  preservesSituationReferences:
    clarifications[0]?.situations[0]?.id === "situation:maxx-project",
  preservesAnswerChoices:
    clarifications[0]?.answerChoices.length === 3,
  supportsFreeFormAnswer:
    clarifications[0]?.allowsFreeFormAnswer === true,
  preservesCreatedAt:
    clarifications[0]?.createdAt === generatedAt,
  rejectsInventedEvidence:
    clarifications.length === 1,
  noAnswerMutation:
    clarifications[0]?.answeredAt === undefined,
};

const passed = Object.values(proof).every(Boolean);

if (!passed) {
  console.error("Clarification request proof failed.");
  console.error(JSON.stringify(proof, null, 2));
  process.exit(1);
}

console.log("Clarification request proof passed.");
console.log(JSON.stringify(proof, null, 2));
