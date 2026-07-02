import { CollaboratesWithRule } from "./collaborates-with-rule";
import { LivesInRule } from "./lives-in-rule";
import { MarriedToRule } from "./married-to-rule";
import { OwnsRule } from "./owns-rule";
import { ReportsToRule } from "./reports-to-rule";
import type { RelationshipRule } from "./relationship-rule";
import { WorksForRule } from "./works-for-rule";

export function createDefaultRelationshipRules(): RelationshipRule[] {
  return [
    new WorksForRule(),
    new LivesInRule(),
    new MarriedToRule(),
    new ReportsToRule(),
    new CollaboratesWithRule(),
    new OwnsRule(),
  ];
}