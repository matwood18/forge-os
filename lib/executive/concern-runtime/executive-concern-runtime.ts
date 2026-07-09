import {
  InMemoryExecutiveConcernRepository,
} from "@/lib/executive/concern";

import {
  BasicExecutiveConcernCoordinator,
} from "@/lib/executive/concern-coordination";

import {
  BasicExecutiveConcernProjector,
} from "@/lib/executive/concern-projection";

import {
  BasicExecutiveConcernReconciliationEngine,
} from "@/lib/executive/concern-reconciliation";

export const executiveConcernRepository =
  new InMemoryExecutiveConcernRepository();

export const executiveConcernProjector =
  new BasicExecutiveConcernProjector();

export const executiveConcernCoordinator =
  new BasicExecutiveConcernCoordinator(
    executiveConcernRepository,
    new BasicExecutiveConcernReconciliationEngine()
  );

