import type { Worldview } from "../worldview";

export type ReasoningSessionId = string;
export type ArgumentId = string;
export type CandidateArgumentId = string;
export type ReasoningGraphId = string;
export type ReasoningNodeId = string;
export type ReasoningEdgeId = string;

export type ArgumentStatus =
  | "supported"
  | "contested"
  | "weak"
  | "inconclusive";

export type ReasoningStrength = "weak" | "moderate" | "strong";

export type ReasoningNodeKind =
  | "belief"
  | "assumption"
  | "inference"
  | "conclusion"
  | "conflict"
  | "question";

export type ReasoningEdgeKind =
  | "supports"
  | "requires"
  | "implies"
  | "conflicts_with"
  | "weakens"
  | "raises_question";

export type ReasoningNode = {
  id: ReasoningNodeId;
  kind: ReasoningNodeKind;
  label: string;
  description?: string;
  confidence: number;
  strength: ReasoningStrength;
  sourceBeliefIds: string[];
};

export type ReasoningEdge = {
  id: ReasoningEdgeId;
  kind: ReasoningEdgeKind;
  fromNodeId: ReasoningNodeId;
  toNodeId: ReasoningNodeId;
  confidence: number;
};

export type ReasoningGraph = {
  id: ReasoningGraphId;
  nodes: ReasoningNode[];
  edges: ReasoningEdge[];
};

export type CandidateArgument = {
  id: CandidateArgumentId;
  claim: string;
  status: ArgumentStatus;
  confidence: number;
  strength: ReasoningStrength;
  supportingBeliefIds: string[];
  assumptionIds: string[];
  counterArgumentIds: string[];
  generatedQuestionIds: string[];
  graph?: ReasoningGraph;
};

export type Argument = {
  id: ArgumentId;
  claim: string;
  status: ArgumentStatus;
  confidence: number;
  strength: ReasoningStrength;
  supportingBeliefIds: string[];
  assumptionIds: string[];
  counterArgumentIds: string[];
  generatedQuestionIds: string[];
  graph?: ReasoningGraph;
};

export type ReasoningSession = {
  id: ReasoningSessionId;
  worldviewId: string;
  objective?: string;
  arguments: Argument[];
  createdAt: Date;
};

export type ReasoningSessionCreateInput = {
  worldviewId: string;
  objective?: string;
  arguments: Argument[];
};

export interface ReasoningEngine {
  reason(input: ReasoningEngineInput): Promise<ReasoningSession>;
}

export type ReasoningEngineInput = {
  worldviewId: string;
  worldview: Worldview;
  objective?: string;
};