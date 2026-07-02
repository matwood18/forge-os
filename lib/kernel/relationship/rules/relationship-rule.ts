import type { ObservationRecord } from "@/lib/kernel/observation";
import type { RelationshipCreateInput } from "../types";

export interface RelationshipRule {
  infer(
    observations: ObservationRecord[],
  ): Promise<RelationshipCreateInput[]>;
}