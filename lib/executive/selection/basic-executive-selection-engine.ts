import type { ExecutiveSelectionEngine } from "./executive-selection-engine";
import type {
  ExecutiveSelectionDecision,
  ExecutiveSelectionInput,
  ExecutiveSelectionResult,
  ExecutiveSelectionSignal,
} from "./types";

function selectionSignalsFor(
  priority: ExecutiveSelectionDecision["priority"]
): ExecutiveSelectionSignal[] {
  const signals: ExecutiveSelectionSignal[] = [];

  const comparisonKinds = priority.comparisonSignals.map(
    (signal) => signal.kind
  );

  if (
    priority.executiveWeight >= 30 ||
    comparisonKinds.includes("blockedWork") ||
    comparisonKinds.includes("dependency")
  ) {
    signals.push({
      kind: "highConsequence",
      label: "Meaningful consequence signal detected",
      weight: 30,
      evidenceIds: [...priority.priority.evidenceIds],
    });
  }

  if (
    comparisonKinds.includes("deadline") ||
    comparisonKinds.includes("concreteNextStep")
  ) {
    signals.push({
      kind: "requiresUserAttention",
      label: "User action appears required",
      weight: 20,
      evidenceIds: [...priority.priority.evidenceIds],
    });
  }

  if (comparisonKinds.includes("relationshipImpact")) {
    signals.push({
      kind: "relationshipRisk",
      label: "Relationship impact detected",
      weight: 25,
      evidenceIds: [...priority.priority.evidenceIds],
    });
  }

  if (
    comparisonKinds.includes("staleness") ||
    comparisonKinds.includes("blockedWork")
  ) {
    signals.push({
      kind: "futureCost",
      label: "Ignoring may create future cost",
      weight: 15,
      evidenceIds: [...priority.priority.evidenceIds],
    });
  }

  return signals;
}

export class BasicExecutiveSelectionEngine
  implements ExecutiveSelectionEngine
{
  select(input: ExecutiveSelectionInput): ExecutiveSelectionResult {
    const decisions = input.priorities.map((priority) => {
      const selectionSignals = selectionSignalsFor(priority);

      const totalWeight = selectionSignals.reduce(
        (sum, signal) => sum + signal.weight,
        0
      );

      const requiresUserAttention = selectionSignals.some(
        (signal) => signal.kind === "requiresUserAttention"
      );

      const decision: "surface" | "quiet" =
        totalWeight >= 30 || requiresUserAttention ? "surface" : "quiet";

      return {
        priority,
        decision,
        selectionSignals,
        originalIndex: priority.originalIndex,
      };
    });

    return {
      decisions,
      generatedAt: input.generatedAt,
    };
  }
}
