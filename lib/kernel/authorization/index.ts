// lib/kernel/authorization/index.ts
export type {
  AuthorizationDecision,
  AuthorizationDecisionAuthority,
  AuthorizationDecisionCreateInput,
  AuthorizationDecisionOutcome,
  AuthorizationInput,
  AuthorizationResult,
} from "./types";

export type { AuthorizationEngine } from "./authorization-engine";

export type { AuthorizationRepository } from "./authorization-repository";

export { BasicAuthorizationEngine } from "./basic-authorization-engine";
export { InMemoryAuthorizationRepository } from "./in-memory-authorization-repository";