// lib/kernel/action/lifecycle/action-lifecycle-engine.ts
import type {
  ActionLifecycleTransitionRequest,
  ActionLifecycleTransitionResult,
} from "./types";

export interface ActionLifecycleEngine {
  transition(
    request: ActionLifecycleTransitionRequest
  ): Promise<ActionLifecycleTransitionResult>;
}