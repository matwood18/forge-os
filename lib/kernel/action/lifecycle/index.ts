// lib/kernel/action/lifecycle/index.ts
export type { ActionLifecycleEngine } from "./action-lifecycle-engine";

export type { ActionLifecycleRepository } from "./action-lifecycle-repository";

export type {
  ActionLifecycleTransition,
  ActionLifecycleTransitionActor,
  ActionLifecycleTransitionActorType,
  ActionLifecycleTransitionCreateInput,
  ActionLifecycleTransitionFailure,
  ActionLifecycleTransitionFailureReason,
  ActionLifecycleTransitionRecord,
  ActionLifecycleTransitionRequest,
  ActionLifecycleTransitionResult,
  ActionLifecycleTransitionSuccess,
} from "./types";

export { BasicActionLifecycleEngine } from "./basic-action-lifecycle-engine";
export { InMemoryActionLifecycleRepository } from "./in-memory-action-lifecycle-repository";