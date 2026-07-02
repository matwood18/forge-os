import type { ObservationRecord } from "@/lib/kernel/observation";
import type { RelationshipEngine } from "./relationship-engine";
import type { RelationshipRepository } from "./relationship-repository";
import type { RelationshipRule } from "./rules";
import type { RelationshipRecord } from "./types";

export class BasicRelationshipEngine implements RelationshipEngine {
  constructor(
    private readonly repository: RelationshipRepository,
    private readonly rules: RelationshipRule[],
  ) {}

  async inferRelationships(
    observations: ObservationRecord[],
  ): Promise<RelationshipRecord[]> {
    const inferredRelationships = await Promise.all(
      this.rules.map((rule) => rule.infer(observations)),
    );

    const flattenedRelationships = inferredRelationships.flat();

    return Promise.all(
      flattenedRelationships.map((relationship) =>
        this.repository.remember(relationship),
      ),
    );
  }
}