import type {
  ImportCheckpoint,
  ImportCheckpointIdentity,
  ImportCheckpointSaveInput,
} from "@/lib/kernel/import-checkpoint/types";
import type { ImportCheckpointRepository } from "@/lib/kernel/import-checkpoint/import-checkpoint-repository";
import type { ImportCursor } from "@/lib/kernel/import-provider";
import { prisma } from "@/lib/infrastructure/prisma/client";

type PersistedImportCheckpoint = Awaited<
  ReturnType<typeof prisma.importCheckpoint.findUnique>
>;

function parseCursor(payload: string | null): ImportCursor | null {
  if (!payload) {
    return null;
  }

  const parsed: unknown = JSON.parse(payload);

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Persisted import checkpoint cursor must be an object.");
  }

  return parsed as ImportCursor;
}

function serializeCursor(cursor: ImportCursor | null): string | null {
  return cursor ? JSON.stringify(cursor) : null;
}

function toDomain(
  record: NonNullable<PersistedImportCheckpoint>
): ImportCheckpoint {
  return {
    id: record.id,
    identity: {
      sourceSystem: record.sourceSystem,
      externalImportId: record.externalImportId,
    },
    cursor: parseCursor(record.cursorPayload),
    completed: record.completed,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class PrismaImportCheckpointRepository
  implements ImportCheckpointRepository
{
  async save(input: ImportCheckpointSaveInput): Promise<ImportCheckpoint> {
    const record = await prisma.importCheckpoint.upsert({
      where: { id: input.id },
      create: {
        id: input.id,
        sourceSystem: input.identity.sourceSystem,
        externalImportId: input.identity.externalImportId,
        cursorPayload: serializeCursor(input.cursor),
        completed: input.completed,
        updatedAt: input.updatedAt,
      },
      update: {
        sourceSystem: input.identity.sourceSystem,
        externalImportId: input.identity.externalImportId,
        cursorPayload: serializeCursor(input.cursor),
        completed: input.completed,
        updatedAt: input.updatedAt,
      },
    });

    return toDomain(record);
  }

  async find(id: string): Promise<ImportCheckpoint | null> {
    const record = await prisma.importCheckpoint.findUnique({
      where: { id },
    });

    return record ? toDomain(record) : null;
  }

  async findByIdentity(
    identity: ImportCheckpointIdentity
  ): Promise<ImportCheckpoint | null> {
    const record = await prisma.importCheckpoint.findUnique({
      where: {
        sourceSystem_externalImportId: {
          sourceSystem: identity.sourceSystem,
          externalImportId: identity.externalImportId,
        },
      },
    });

    return record ? toDomain(record) : null;
  }
}
