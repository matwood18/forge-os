// lib/kernel/action/lifecycle/action-lifecycle-repository.ts
import type {
  ActionLifecycleTransitionCreateInput,
  ActionLifecycleTransitionRecord,
} from "./types";

export interface ActionLifecycleRepository {
  remember(
    transition: ActionLifecycleTransitionCreateInput
  ): Promise<ActionLifecycleTransitionRecord>;

  forAction(actionId: string): Promise<ActionLifecycleTransitionRecord[]>;

  forExecution(
    executionId: string
  ): Promise<ActionLifecycleTransitionRecord[]>;

  all(): Promise<ActionLifecycleTransitionRecord[]>;
}