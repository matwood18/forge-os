import type { ObservationRecord } from "@/lib/kernel/observation";
import type { RelationshipRecord } from "./types";

export interface RelationshipEngine {
  inferRelationships(
    observations: ObservationRecord[],
  ): Promise<RelationshipRecord[]>;
}