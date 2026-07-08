import type {
  ContextReflectionEngine,
} from "./context-reflection-engine";

import type {
  ContextReflectionInput,
  PersonalContextReflection,
} from "./types";

export class BasicContextReflectionEngine
  implements ContextReflectionEngine
{
  async reflect(
    input: ContextReflectionInput
  ): Promise<PersonalContextReflection> {
    const signalLabels = input.signals.map(
      (signal) => signal.label
    );

    return {
      id: crypto.randomUUID(),

      summary:
        signalLabels.length > 0
          ? "The input contains signals that may represent meaningful personal context."
          : "The input did not contain meaningful contextual signals.",

      evidence: {
        sourceEventId: input.eventId,
        signals: signalLabels,
      },

      importance:
        input.signals.some(
          (signal) =>
            signal.kind === "unresolved_obligation" ||
            signal.kind === "relationship_impact"
        )
          ? "high"
          : "medium",

      confidence:
        input.signals.length > 0
          ? Math.min(
              0.9,
              input.signals.reduce(
                (total, signal) =>
                  total + signal.confidence,
                0
              ) / input.signals.length
            )
          : 0.2,

      createdAt: new Date(),
    };
  }
}
