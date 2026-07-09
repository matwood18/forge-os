import type { ExecutiveReasonedPriority } from "@/lib/executive/reasoning";
import type { ExecutiveComparisonEngine } from "./executive-comparison-engine";
import type {
  ExecutiveComparedPriority,
  ExecutiveComparisonInput,
  ExecutiveComparisonResult,
  ExecutiveComparisonSignal,
  ExecutiveComparisonSignalKind,
} from "./types";

const SIGNAL_WEIGHTS: Record<ExecutiveComparisonSignalKind, number> = {
  deadline: 30,
  personAffected: 24,
  relationshipImpact: 22,
  dependency: 20,
  blockedWork: 18,
  repeatedMention: 12,
  staleness: 10,
  concreteNextStep: 8,
};

function priorityText(priority: ExecutiveReasonedPriority): string {
  return [
    priority.title,
    priority.rationale,
    priority.suggestedNextStep,
  ].join(" ").toLowerCase();
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function signal(
  kind: ExecutiveComparisonSignalKind,
  label: string,
  priority: ExecutiveReasonedPriority
): ExecutiveComparisonSignal {
  return {
    kind,
    label,
    weight: SIGNAL_WEIGHTS[kind],
    evidenceIds: [...priority.evidenceIds],
  };
}

function comparisonSignalsFor(
  priority: ExecutiveReasonedPriority
): ExecutiveComparisonSignal[] {
  const text = priorityText(priority);
  const signals: ExecutiveComparisonSignal[] = [];

  if (
    hasAny(text, [
      /\bbefore\b/,
      /\bby\b/,
      /\bdue\b/,
      /\bdeadline\b/,
      /\btoday\b/,
      /\btomorrow\b/,
      /\bfriday\b/,
      /\bmonday\b/,
      /\btuesday\b/,
      /\bwednesday\b/,
      /\bthursday\b/,
      /\bsaturday\b/,
      /\bsunday\b/,
    ])
  ) {
    signals.push(signal("deadline", "Time boundary detected", priority));
  }

  if (
    hasAny(text, [
      /\baffected\b/,
      /\basked\b/,
      /\bwaiting\b/,
      /\bupdate\b/,
      /\bdepending\b/,
      /\bpromised\b/,
    ])
  ) {
    signals.push(signal("personAffected", "Another person is affected", priority));
  }

  if (
    hasAny(text, [
      /\bmad\b/,
      /\bupset\b/,
      /\bfrustrated\b/,
      /\brelationship\b/,
      /\btrust\b/,
      /\bexpectation\b/,
    ])
  ) {
    signals.push(
      signal("relationshipImpact", "Relationship impact detected", priority)
    );
  }

  if (
    hasAny(text, [
      /\bblocks?\b/,
      /\bblocked\b/,
      /\bblocking\b/,
      /\bdepends? on\b/,
      /\bdependency\b/,
      /\bneeded before\b/,
      /\benables?\b/,
    ])
  ) {
    signals.push(signal("dependency", "Dependency or enabling work detected", priority));
  }

  if (
    hasAny(text, [
      /\bstuck\b/,
      /\bwaiting on\b/,
      /\bcannot proceed\b/,
      /\bcan't proceed\b/,
      /\bunresolved\b/,
    ])
  ) {
    signals.push(signal("blockedWork", "Blocked or unresolved work detected", priority));
  }

  if (
    hasAny(text, [
      /\bagain\b/,
      /\brepeated\b/,
      /\bkeeps? coming up\b/,
      /\bstill\b/,
    ])
  ) {
    signals.push(signal("repeatedMention", "Repeated mention detected", priority));
  }

  if (
    hasAny(text, [
      /\boverdue\b/,
      /\bstale\b/,
      /\bold\b/,
      /\bignored\b/,
      /\bnot contacted\b/,
    ])
  ) {
    signals.push(signal("staleness", "Stale or delayed item detected", priority));
  }

  if (priority.suggestedNextStep.trim().length > 0) {
    signals.push(signal("concreteNextStep", "Concrete next step exists", priority));
  }

  return signals;
}

function executiveWeightFor(signals: ExecutiveComparisonSignal[]): number {
  return signals.reduce((total, signal) => total + signal.weight, 0);
}

export class BasicExecutiveComparisonEngine implements ExecutiveComparisonEngine {
  compare(input: ExecutiveComparisonInput): ExecutiveComparisonResult {
    const compared: ExecutiveComparedPriority[] = input.priorities.map(
      (priority, originalIndex) => {
        const comparisonSignals = comparisonSignalsFor(priority);

        return {
          priority,
          comparisonSignals,
          executiveWeight: executiveWeightFor(comparisonSignals),
          originalIndex,
        };
      }
    );

    return {
      priorities: compared.sort((a, b) => {
        if (b.executiveWeight !== a.executiveWeight) {
          return b.executiveWeight - a.executiveWeight;
        }

        return a.originalIndex - b.originalIndex;
      }),
      generatedAt: input.generatedAt,
    };
  }
}
