import {
  PrismaExecutiveConcernRepository,
} from "@/lib/infrastructure/executive-concern";

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
  new PrismaExecutiveConcernRepository();

export const executiveConcernProjector =
  new BasicExecutiveConcernProjector();

export const executiveConcernCoordinator =
  new BasicExecutiveConcernCoordinator(
    executiveConcernRepository,
    new BasicExecutiveConcernReconciliationEngine()
  );

