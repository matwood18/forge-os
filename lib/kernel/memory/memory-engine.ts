import {
  DiminishingReturnsMemoryConfidencePolicy,
  type MemoryConfidencePolicy,
} from "./memory-confidence-policy";
import type { MemoryRepository } from "./memory-repository";
import type {
  MemoryAssertion,
  MemoryCreateInput,
  MemoryQuery,
  MemoryRecord,
} from "./types";

export class MemoryEngine {
  constructor(
    private readonly memoryRepository: MemoryRepository,
    private readonly confidencePolicy: MemoryConfidencePolicy =
      new DiminishingReturnsMemoryConfidencePolicy()
  ) {}

  async remember(memory: MemoryCreateInput): Promise<MemoryRecord> {
    const existing = await this.memoryRepository.findMatchingBelief(memory);

    if (!existing) {
      const created = await this.memoryRepository.remember(memory);

      await this.memoryRepository.addConfidenceSnapshot({
        memoryId: created.id,
        confidence: created.confidence,
        reason: "Memory created from initial belief.",
      });

      return created;
    }

    const confidence = this.confidencePolicy.reinforce(
      existing,
      memory.confidence
    );

    return this.memoryRepository.confirm(
      existing.id,
      confidence,
      "Memory reinforced by matching belief."
    );
  }

  async rememberAssertion(assertion: MemoryAssertion): Promise<MemoryRecord> {
    const existing = await this.memoryRepository.findMatchingBelief(
      assertion.belief
    );

    if (existing) {
      const duplicateEvidence = await this.memoryRepository.findEvidence(
        existing.id,
        assertion.evidence.evidenceKind,
        assertion.evidence.evidenceId
      );

      if (duplicateEvidence) {
        return existing;
      }
    }

    const memory = await this.remember(assertion.belief);

    await this.memoryRepository.addEvidence({
      memoryId: memory.id,
      ...assertion.evidence,
    });

    return memory;
  }

  find(query: MemoryQuery): Promise<MemoryRecord[]> {
    return this.memoryRepository.find(query);
  }

  all(): Promise<MemoryRecord[]> {
    return this.memoryRepository.all();
  }
}