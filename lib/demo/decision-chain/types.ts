import type { ActionInspectorItem } from "../action";
import type { AuthorizationDecisionInspectorItem } from "../authorization";
import type { RecommendationInspectorItem } from "../recommendation";
import type { ReflectionInspectorItem } from "../reflection";

export type DecisionChainItem = {
  id: string;
  executionId: string;
  reflections: ReflectionInspectorItem[];
  recommendation: RecommendationInspectorItem;
  authorizationDecision: AuthorizationDecisionInspectorItem;
  action: ActionInspectorItem;
  headline: string;
  explanation: string;
};

export type DecisionChainProjection = {
  id: string;
  items: DecisionChainItem[];
};