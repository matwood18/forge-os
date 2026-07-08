// lib/kernel/semantic-claim/index.ts
export type {
  SemanticClaim,
  SemanticClaimEngineInput,
  SemanticClaimEngineResult,
  SemanticClaimProvenance,
} from "./types";

export type { SemanticClaimRepository } from "./semantic-claim-repository";
export type { SemanticClaimEngine } from "./semantic-claim-engine";

export { InMemorySemanticClaimRepository } from "./in-memory-semantic-claim-repository";
export { BasicSemanticClaimEngine } from "./basic-semantic-claim-engine";