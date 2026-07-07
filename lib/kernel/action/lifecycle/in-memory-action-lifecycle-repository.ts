// lib/kernel/action/lifecycle/in-memory-action-lifecycle-repository.ts
import type { ActionLifecycleRepository } from "./action-lifecycle-repository";
import type {
  ActionLifecycleTransitionCreateInput,
  ActionLifecycleTransitionRecord,
} from "./types";

export class InMemoryActionLifecycleRepository
  implements ActionLifecycleRepository
{
  private readonly transitions: ActionLifecycleTransitionRecord[] = [];

  async remember(
    transition: ActionLifecycleTransitionCreateInput
  ): Promise<ActionLifecycleTransitionRecord> {
    const record: ActionLifecycleTransitionRecord = {
      ...transition,
      id: crypto.randomUUID(),
      actor: { ...transition.actor },
      createdAt: new Date(),
    };

    this.transitions.push(record);

    return this.copy(record);
  }

  async forAction(
    actionId: string
  ): Promise<ActionLifecycleTransitionRecord[]> {
    return this.transitions
      .filter((transition) => transition.actionId === actionId)
      .map((transition) => this.copy(transition));
  }

  async forExecution(
    executionId: string
  ): Promise<ActionLifecycleTransitionRecord[]> {
    return this.transitions
      .filter((transition) => transition.executionId === executionId)
      .map((transition) => this.copy(transition));
  }

  async all(): Promise<ActionLifecycleTransitionRecord[]> {
    return this.transitions.map((transition) =>
      this.copy(transition)
    );
  }

  private copy(
    transition: ActionLifecycleTransitionRecord
  ): ActionLifecycleTransitionRecord {
    return {
      ...transition,
      actor: { ...transition.actor },
      createdAt: new Date(transition.createdAt),
    };
  }
}