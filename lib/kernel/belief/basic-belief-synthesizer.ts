import type { MemoryRecord } from "@/lib/kernel/memory";

import type { BeliefSynthesizer } from "./belief-synthesizer";
import type {
  Belief,
  BeliefEvidence,
  BeliefStatus,
  BeliefStrength,
} from "./types";

type BeliefAccumulator = {
  subjectEntityId: string;
  predicate: string;
  objectEntityId?: string | null;
  objectValue?: string | null;
  memories: MemoryRecord[];
};

export class BasicBeliefSynthesizer implements BeliefSynthesizer {
  synthesize(memories: MemoryRecord[]): Belief[] {
    const generatedAt = new Date();

    const accumulators = this.groupMemories(memories);

    return [...accumulators.values()].map((accumulator) =>
      this.createBeliefFromAccumulator(accumulator, generatedAt)
    );
  }

  private groupMemories(
    memories: MemoryRecord[]
  ): Map<string, BeliefAccumulator> {
    const accumulators = new Map<string, BeliefAccumulator>();

    for (const memory of memories) {
      const key = this.getBeliefKey(memory);
      const existing = accumulators.get(key);

      if (existing) {
        existing.memories.push(memory);
        continue;
      }

      accumulators.set(key, {
        subjectEntityId: memory.subjectEntityId,
        predicate: memory.predicate,
        objectEntityId: memory.objectEntityId,
        objectValue: memory.objectValue,
        memories: [memory],
      });
    }

    return accumulators;
  }

  private createBeliefFromAccumulator(
    accumulator: BeliefAccumulator,
    generatedAt: Date
  ): Belief {
    const confidence = this.calculateConfidence(accumulator.memories);
    const evidence = this.createEvidence(accumulator.memories);

    return {
      id: crypto.randomUUID(),
      subjectEntityId: accumulator.subjectEntityId,
      predicate: accumulator.predicate,
      objectEntityId: accumulator.objectEntityId,
      objectValue: accumulator.objectValue,
      status: this.calculateStatus(accumulator.memories),
      strength: this.getStrength(confidence),
      confidence,
      evidence,
      generatedAt,
    };
  }

  private createEvidence(memories: MemoryRecord[]): BeliefEvidence[] {
    return memories.map((memory) => ({
      memoryId: memory.id,
      memory,
      confidence: memory.confidence,
      reinforcedAt: memory.lastConfirmedAt,
    }));
  }

  private calculateConfidence(memories: MemoryRecord[]): number {
    const combinedConfidence =
      memories.reduce((total, memory) => total + memory.confidence, 0) /
      memories.length;

    return Number(combinedConfidence.toFixed(4));
  }

  private calculateStatus(memories: MemoryRecord[]): BeliefStatus {
    if (memories.some((memory) => memory.status === "active")) {
      return "active";
    }

    if (memories.some((memory) => memory.status === "contradicted")) {
      return "contradicted";
    }

    if (memories.some((memory) => memory.status === "stale")) {
      return "stale";
    }

    return "superseded";
  }

  private getStrength(confidence: number): BeliefStrength {
    if (confidence >= 0.85) {
      return "strong";
    }

    if (confidence >= 0.6) {
      return "moderate";
    }

    return "weak";
  }

  private getBeliefKey(memory: MemoryRecord): string {
    return [
      memory.subjectEntityId,
      memory.predicate,
      memory.objectEntityId ?? "",
      memory.objectValue ?? "",
    ].join("::");
  }
}