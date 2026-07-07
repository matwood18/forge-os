// lib/kernel/action/lifecycle/basic-action-lifecycle-engine.ts
import type { ActionRepository } from "../action-repository";
import type { ActionStatus } from "../types";

import type { ActionLifecycleEngine } from "./action-lifecycle-engine";
import type { ActionLifecycleRepository } from "./action-lifecycle-repository";
import type {
  ActionLifecycleTransition,
  ActionLifecycleTransitionRequest,
  ActionLifecycleTransitionResult,
} from "./types";

export class BasicActionLifecycleEngine
  implements ActionLifecycleEngine
{
  constructor(
    private readonly actionRepository: ActionRepository,
    private readonly lifecycleRepository: ActionLifecycleRepository
  ) {}

  async transition(
    request: ActionLifecycleTransitionRequest
  ): Promise<ActionLifecycleTransitionResult> {
    const action = await this.actionRepository.byId(request.actionId);

    if (!action) {
      return {
        ok: false,
        reason: "action_not_found",
        message: `Action ${request.actionId} could not be found.`,
      };
    }

    const toStatus = this.resolveNextStatus(
      action.status,
      request.transition
    );

    if (!toStatus) {
      return {
        ok: false,
        reason: "invalid_transition",
        message: `Action ${action.id} cannot transition from ${action.status} using ${request.transition}.`,
        action,
      };
    }

    const updatedAction = await this.actionRepository.updateStatus(
      action.id,
      toStatus
    );

    if (!updatedAction) {
      return {
        ok: false,
        reason: "action_not_found",
        message: `Action ${action.id} could not be found while applying lifecycle transition.`,
      };
    }

    const transition = await this.lifecycleRepository.remember({
      actionId: action.id,
      executionId: action.executionId,
      transition: request.transition,
      fromStatus: action.status,
      toStatus,
      actor: request.actor,
      reason: request.reason,
    });

    return {
      ok: true,
      action: updatedAction,
      transition,
    };
  }

  private resolveNextStatus(
    currentStatus: ActionStatus,
    transition: ActionLifecycleTransition
  ): ActionStatus | null {
    if (currentStatus !== "pending") {
      return null;
    }

    if (transition === "approve") {
      return "approved";
    }

    if (transition === "reject") {
      return "rejected";
    }

    if (transition === "cancel") {
      return "cancelled";
    }

    return null;
  }
}