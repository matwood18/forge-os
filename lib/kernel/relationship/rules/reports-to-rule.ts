import type { ObservationRecord } from "@/lib/kernel/observation";
import type { RelationshipCreateInput } from "../types";
import { inferRelationshipsByPredicate } from "./infer-relationships-by-predicate";
import type { RelationshipRule } from "./relationship-rule";

export class ReportsToRule implements RelationshipRule {
  async infer(
    observations: ObservationRecord[],
  ): Promise<RelationshipCreateInput[]> {
    return inferRelationshipsByPredicate(observations, "reports_to");
  }
}