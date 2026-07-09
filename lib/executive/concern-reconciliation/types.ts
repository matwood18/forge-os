import type {
  ExecutiveConcern,
  ExecutiveConcernCreateInput,
  ExecutiveConcernUpdateInput,
} from "@/lib/executive/concern";

export type ExecutiveConcernObservation = {
  concernId: string;
  title: string;
  importance: ExecutiveConcern["importance"];
  confidence: number;
  observedAt: Date;
  evidence: ExecutiveConcernCreateInput["evidence"];
  latestRecommendation?: ExecutiveConcern["latestRecommendation"];
  clarificationNeeded?: ExecutiveConcern["clarificationNeeded"];
};

export type ExecutiveConcernReconciliationDecision =
  | {
      kind: "create";
      concernId: string;
      createInput: ExecutiveConcernCreateInput;
      reason: string;
    }
  | {
      kind: "update";
      concernId: string;
      updateInput: ExecutiveConcernUpdateInput;
      reason: string;
    }
  | {
      kind: "no_change";
      concernId: string;
      reason: string;
    };

export type ExecutiveConcernReconciliationInput = {
  existingConcern?: ExecutiveConcern;
  observation: ExecutiveConcernObservation;
};

