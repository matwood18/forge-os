import type { Belief, BeliefStrength } from "../belief";
import type { Worldview } from "../worldview";

import type { WorldModel } from "./types";

export class WorldModelReasoningAdapter {
  toWorldview(worldModel: WorldModel): Worldview {
    return {
      generatedAt: worldModel.generatedAt,
      beliefs: worldModel.memories
        .filter((memory) => memory.status === "active")
        .map((memory): Belief => {
          return {
            id: `belief-from-memory-${memory.id}`,
            subjectEntityId: memory.subjectEntityId,
            predicate: memory.predicate,
            objectEntityId: memory.objectEntityId,
            objectValue: memory.objectValue,
            status: "active",
            strength: this.getStrength(memory.confidence),
            confidence: memory.confidence,
            evidence: [
              {
                memoryId: memory.id,
                memory,
                confidence: memory.confidence,
                reinforcedAt: memory.lastConfirmedAt,
              },
            ],
            generatedAt: worldModel.generatedAt,
          };
        }),
    };
  }

  private getStrength(confidence: number): BeliefStrength {
    if (confidence >= 0.8) {
      return "strong";
    }

    if (confidence >= 0.5) {
      return "moderate";
    }

    return "weak";
  }
}