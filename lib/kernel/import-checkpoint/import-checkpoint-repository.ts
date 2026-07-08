// lib/kernel/import-checkpoint/import-checkpoint-repository.ts
import type {
  ImportCheckpoint,
  ImportCheckpointIdentity,
  ImportCheckpointSaveInput,
} from "./types";

export interface ImportCheckpointRepository {
  save(input: ImportCheckpointSaveInput): Promise<ImportCheckpoint>;
  find(id: string): Promise<ImportCheckpoint | null>;
  findByIdentity(
    identity: ImportCheckpointIdentity
  ): Promise<ImportCheckpoint | null>;
}
