import type {
  ImportCancellation,
  ImportCancellationIdentity,
  ImportCancellationRequest,
} from "./types";

export interface ImportCancellationRepository {
  request(
    input: ImportCancellationRequest
  ): Promise<ImportCancellation>;

  findByIdentity(
    identity: ImportCancellationIdentity
  ): Promise<ImportCancellation | null>;

  cancel(
    identity: ImportCancellationIdentity,
    cancelledAt?: Date
  ): Promise<ImportCancellation | null>;
}
