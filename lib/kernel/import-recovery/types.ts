export type ImportRecoveryReason =
  | "active"
  | "completed"
  | "cancelled"
  | "failed"
  | "checkpoint_available"
  | "missing_checkpoint";

export type ImportRecoveryDecision = {
  resumable: boolean;
  reason: ImportRecoveryReason;
  requiresOwnership: boolean;
};

export type ImportRecoveryInput = {
  status:
    | "pending"
    | "running"
    | "completed"
    | "completed_with_failures"
    | "failed";

  checkpointExists: boolean;
  checkpointCompleted: boolean;

  cancellationRequested: boolean;

  leaseActive: boolean;
};
