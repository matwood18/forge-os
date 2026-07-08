// lib/kernel/import-checkpoint/in-memory-import-checkpoint-repository.ts
import type { ImportCheckpointRepository } from "./import-checkpoint-repository";
import type {
  ImportCheckpoint,
  ImportCheckpointIdentity,
  ImportCheckpointSaveInput,
} from "./types";

export class InMemoryImportCheckpointRepository
  implements ImportCheckpointRepository
{
  private readonly checkpoints = new Map<string, ImportCheckpoint>();

  async save(input: ImportCheckpointSaveInput): Promise<ImportCheckpoint> {
    const existing = await this.findByIdentity(input.identity);
    const updatedAt = input.updatedAt ?? new Date();

    const checkpoint: ImportCheckpoint = {
      id: existing?.id ?? input.id,
      identity: input.identity,
      cursor: input.cursor,
      completed: input.completed,
      createdAt: existing?.createdAt ?? updatedAt,
      updatedAt,
    };

    this.checkpoints.set(checkpoint.id, checkpoint);

    return checkpoint;
  }

  async find(id: string): Promise<ImportCheckpoint | null> {
    return this.checkpoints.get(id) ?? null;
  }

  async findByIdentity(
    identity: ImportCheckpointIdentity
  ): Promise<ImportCheckpoint | null> {
    return (
      [...this.checkpoints.values()].find(
        (checkpoint) =>
          checkpoint.identity.sourceSystem === identity.sourceSystem &&
          checkpoint.identity.externalImportId === identity.externalImportId
      ) ?? null
    );
  }
}
