import { BasicExecutiveComparisonEngine } from "@/lib/executive/comparison";
import type { ExecutiveReasonedPriority } from "@/lib/executive/reasoning";

const generatedAt = new Date("2026-07-09T16:00:00.000Z");

const priorities: ExecutiveReasonedPriority[] = [
  {
    title: "Organize desk",
    rationale: "This would be useful later.",
    suggestedNextStep: "Clear the desk.",
    evidenceIds: ["evidence:desk"],
    confidence: 0.7,
  },
  {
    title: "Call the dentist before Friday",
    rationale: "This has a deadline before Friday.",
    suggestedNextStep: "Call the dentist.",
    evidenceIds: ["evidence:dentist"],
    confidence: 0.8,
  },
  {
    title: "Contact insurance",
    rationale:
      "Jess is mad and affected because the insurance responsibility is unresolved.",
    suggestedNextStep: "Contact insurance and update Jess.",
    evidenceIds: ["evidence:insurance"],
    confidence: 0.84,
  },
  {
    title: "Send project file",
    rationale:
      "This blocks Maxx because his project depends on this file.",
    suggestedNextStep: "Send the project file to Maxx.",
    evidenceIds: ["evidence:maxx"],
    confidence: 0.82,
  },
];

const result = new BasicExecutiveComparisonEngine().compare({
  priorities,
  generatedAt,
});

const emptyResult = new BasicExecutiveComparisonEngine().compare({
  priorities: [],
  generatedAt,
});

const tieResult = new BasicExecutiveComparisonEngine().compare({
  priorities: [
    {
      title: "First neutral item",
      rationale: "Useful later.",
      suggestedNextStep: "",
      evidenceIds: ["evidence:first"],
      confidence: 0.5,
    },
    {
      title: "Second neutral item",
      rationale: "Useful later.",
      suggestedNextStep: "",
      evidenceIds: ["evidence:second"],
      confidence: 0.5,
    },
  ],
  generatedAt,
});

const insurance = result.priorities.find(
  (priority) => priority.priority.title === "Contact insurance"
);

const dentist = result.priorities.find(
  (priority) => priority.priority.title === "Call the dentist before Friday"
);

const desk = result.priorities.find(
  (priority) => priority.priority.title === "Organize desk"
);

const project = result.priorities.find(
  (priority) => priority.priority.title === "Send project file"
);

const proof = {
  returnsAllPriorities: result.priorities.length === priorities.length,
  emptyInputReturnsEmptyOutput: emptyResult.priorities.length === 0,
  preservesGeneratedAt: result.generatedAt === generatedAt,
  preservesSourcePriorityObjects:
    insurance?.priority === priorities[2] &&
    dentist?.priority === priorities[1],
  preservesEvidenceIds:
    insurance?.comparisonSignals.every(
      (signal) => signal.evidenceIds[0] === "evidence:insurance"
    ) === true,
  deadlineBeatsVague:
    (dentist?.executiveWeight ?? 0) > (desk?.executiveWeight ?? 0),
  personAffectedBeatsIsolated:
    (insurance?.executiveWeight ?? 0) > (desk?.executiveWeight ?? 0),
  dependencyIsSurfaced:
    project?.comparisonSignals.some(
      (signal) => signal.kind === "dependency"
    ) === true,
  relationshipImpactIsSurfaced:
    insurance?.comparisonSignals.some(
      (signal) => signal.kind === "relationshipImpact"
    ) === true,
  deterministicOrdering:
    result.priorities.map((priority) => priority.priority.title).join("|") ===
    new BasicExecutiveComparisonEngine()
      .compare({ priorities, generatedAt })
      .priorities.map((priority) => priority.priority.title)
      .join("|"),
  stableTieOrdering:
    tieResult.priorities[0]?.priority.title === "First neutral item" &&
    tieResult.priorities[1]?.priority.title === "Second neutral item",
  doesNotInventEvidence:
    result.priorities.every((priority) =>
      priority.comparisonSignals.every((signal) =>
        signal.evidenceIds.every((evidenceId) =>
          priority.priority.evidenceIds.includes(evidenceId)
        )
      )
    ),
};

const passed = Object.values(proof).every(Boolean);

if (!passed) {
  console.error("Executive comparison proof failed.");
  console.error(JSON.stringify(proof, null, 2));
  process.exit(1);
}

console.log("Executive comparison proof passed.");
console.log(JSON.stringify(proof, null, 2));
