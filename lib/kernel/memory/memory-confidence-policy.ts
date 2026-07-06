import type { MemoryRecord } from "./types";

export interface MemoryConfidencePolicy {
  reinforce(existing: MemoryRecord, incomingConfidence: number): number;
}

export class DiminishingReturnsMemoryConfidencePolicy
  implements MemoryConfidencePolicy
{
  constructor(private readonly reinforcementRate = 0.5) {
    assertUnitInterval(reinforcementRate, "reinforcementRate");
  }

  reinforce(existing: MemoryRecord, incomingConfidence: number): number {
    assertUnitInterval(existing.confidence, "existing.confidence");
    assertUnitInterval(incomingConfidence, "incomingConfidence");

    const confidence =
      existing.confidence +
      (1 - existing.confidence) *
        incomingConfidence *
        this.reinforcementRate;

    return Math.min(1, confidence);
  }
}

function assertUnitInterval(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${name} must be between 0 and 1.`);
  }
}