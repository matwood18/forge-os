import type {
  ImportSession,
  ImportSessionExternalIdentity,
} from "@/lib/kernel/import-session/types";
import type { ImportSessionRepository } from "@/lib/kernel/import-session/import-session-repository";
import { prisma } from "@/lib/infrastructure/prisma/client";

type PersistedImportSession = Awaited<
  ReturnType<typeof prisma.importSession.findUnique>
>;

function toDomain(record: NonNullable<PersistedImportSession>): ImportSession {
  return {
    id: record.id,
    externalIdentity: {
      sourceSystem: record.sourceSystem,
      externalId: record.externalId,
    },
    status: record.status as ImportSession["status"],
    counts: {
      discovered: record.discovered,
      processed: record.processed,
      succeeded: record.succeeded,
      failed: record.failed,
    },
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class PrismaImportSessionRepository
  implements ImportSessionRepository
{
  async save(session: ImportSession): Promise<ImportSession> {
    const record = await prisma.importSession.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        sourceSystem: session.externalIdentity.sourceSystem,
        externalId: session.externalIdentity.externalId,
        status: session.status,
        discovered: session.counts.discovered,
        processed: session.counts.processed,
        succeeded: session.counts.succeeded,
        failed: session.counts.failed,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      update: {
        sourceSystem: session.externalIdentity.sourceSystem,
        externalId: session.externalIdentity.externalId,
        status: session.status,
        discovered: session.counts.discovered,
        processed: session.counts.processed,
        succeeded: session.counts.succeeded,
        failed: session.counts.failed,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        updatedAt: session.updatedAt,
      },
    });

    return toDomain(record);
  }

  async find(id: string): Promise<ImportSession | null> {
    const record = await prisma.importSession.findUnique({
      where: { id },
    });

    return record ? toDomain(record) : null;
  }

  async findByExternalIdentity(
    identity: ImportSessionExternalIdentity
  ): Promise<ImportSession | null> {
    const record = await prisma.importSession.findUnique({
      where: {
        sourceSystem_externalId: {
          sourceSystem: identity.sourceSystem,
          externalId: identity.externalId,
        },
      },
    });

    return record ? toDomain(record) : null;
  }

  async list(): Promise<ImportSession[]> {
    const records = await prisma.importSession.findMany({
      orderBy: { createdAt: "asc" },
    });

    return records.map(toDomain);
  }
}
