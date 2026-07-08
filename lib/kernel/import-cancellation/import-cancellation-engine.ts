import type { ImportCancellationIdentity } from "./types";

export interface ImportCancellationEngine {
  requestCancellation(input: {
    identity: ImportCancellationIdentity;
    reason?: string;
    now?: Date;
  }): Promise<void>;

  isCancellationRequested(
    identity: ImportCancellationIdentity
  ): Promise<boolean>;

  markCancelled(
    identity: ImportCancellationIdentity,
    now?: Date
  ): Promise<void>;
}
