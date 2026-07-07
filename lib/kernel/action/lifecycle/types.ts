// lib/kernel/action/lifecycle/types.ts
import type { ActionRecord, ActionStatus } from "../types";

export type ActionLifecycleTransition =
  | "approve"
  | "reject"
  | "cancel";

export type ActionLifecycleTransitionActorType =
  | "system"
  | "human";

export type ActionLifecycleTransitionActor = {
  type: ActionLifecycleTransitionActorType;
  id: string;
  displayName: string;
};

export type ActionLifecycleTransitionRecord = {
  id: string;

  actionId: string;
  executionId: string;

  transition: ActionLifecycleTransition;

  fromStatus: ActionStatus;
  toStatus: ActionStatus;

  actor: ActionLifecycleTransitionActor;

  reason: string;

  createdAt: Date;
};

export type ActionLifecycleTransitionCreateInput = Omit<
  ActionLifecycleTransitionRecord,
  "id" | "createdAt"
>;

export type ActionLifecycleTransitionRequest = {
  actionId: string;
  transition: ActionLifecycleTransition;
  actor: ActionLifecycleTransitionActor;
  reason: string;
};

export type ActionLifecycleTransitionFailureReason =
  | "action_not_found"
  | "invalid_transition";

export type ActionLifecycleTransitionSuccess = {
  ok: true;
  action: ActionRecord;
  transition: ActionLifecycleTransitionRecord;
};

export type ActionLifecycleTransitionFailure = {
  ok: false;
  reason: ActionLifecycleTransitionFailureReason;
  message: string;
  action?: ActionRecord;
};

export type ActionLifecycleTransitionResult =
  | ActionLifecycleTransitionSuccess
  | ActionLifecycleTransitionFailure;