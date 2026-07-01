export type {
  IdentityEvidence,
  IdentityKind,
  IdentityResolutionResult,
  IdentityResolutionStatus,
} from "./types";
export type { IdentityResolver } from "./resolver";
export { createIdentityResolutionQuestion } from "./question-factory";
export { UnresolvedIdentityResolver } from "./unresolved-resolver";
export { runIdentityResolutionSmokeTest } from "./smoke-test";