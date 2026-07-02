import type { ObservationRepository } from "@/lib/kernel/observation/observation-repository";
import type { EntityRepository } from "@/lib/kernel/repositories";
import type { LearnEntityInput, LearnEntityResult } from "./types";

export class MemoryService {
  constructor(
    private readonly entityRepository?: EntityRepository,
    private readonly observationRepository?: ObservationRepository
  ) {}

  async learnEntity(input: LearnEntityInput): Promise<LearnEntityResult | null> {
    if (!this.entityRepository) {
      return null;
    }

    const existing = await this.entityRepository.recallByDisplayName(
      input.displayName
    );

    if (existing) {
      return {
        id: existing.id,
        type: existing.type,
        displayName: existing.displayName,
      };
    }

    const entity = await this.entityRepository.remember(input);

    await this.observationRepository?.remember({
      subjectEntityId: entity.id,
      predicate: "identified_as",
      objectEntityId: null,
      objectValue: entity.displayName,
      confidence: 1,
      sourceEventId: null,
    });

    return {
      id: entity.id,
      type: entity.type,
      displayName: entity.displayName,
    };
  }

  async entities() {
    if (!this.entityRepository) {
      return [];
    }

    return this.entityRepository.all();
  }
}