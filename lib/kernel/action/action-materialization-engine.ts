// lib/kernel/action/action-materialization-engine.ts
import type { AuthorizationDecision } from "../authorization";
import type { RecommendationRecord } from "../recommendation";

import type { ActionRecord } from "./types";

export type ActionMaterializationInput = {
  executionId: string;
  recommendations: RecommendationRecord[];
  authorizationDecisions: AuthorizationDecision[];
};

export type ActionMaterializationResult = {
  actions: ActionRecord[];
};

export interface ActionMaterializationEngine {
  materialize(
    input: ActionMaterializationInput
  ): Promise<ActionMaterializationResult>;
}