import type { ImportRecoveryEngine } from "./import-recovery-engine";
import type {
  ImportRecoveryDecision,
  ImportRecoveryInput,
} from "./types";

export class BasicImportRecoveryEngine
  implements ImportRecoveryEngine
{
  evaluate(
    input: ImportRecoveryInput
  ): ImportRecoveryDecision {
    if (
      input.status === "completed" ||
      input.status === "completed_with_failures"
    ) {
      return {
        resumable: false,
        reason: "completed",
        requiresOwnership: false,
      };
    }

    if (input.cancellationRequested) {
      return {
        resumable: false,
        reason: "cancelled",
        requiresOwnership: false,
      };
    }

    if (
      input.checkpointExists &&
      !input.checkpointCompleted &&
      !input.leaseActive
    ) {
      return {
        resumable: true,
        reason: "checkpoint_available",
        requiresOwnership: true,
      };
    }

    if (input.leaseActive) {
      return {
        resumable: false,
        reason: "active",
        requiresOwnership: false,
      };
    }

    if (input.status === "failed") {
      return {
        resumable: input.checkpointExists,
        reason: input.checkpointExists
          ? "checkpoint_available"
          : "missing_checkpoint",
        requiresOwnership: input.checkpointExists,
      };
    }

    return {
      resumable: false,
      reason: "missing_checkpoint",
      requiresOwnership: false,
    };
  }
}
