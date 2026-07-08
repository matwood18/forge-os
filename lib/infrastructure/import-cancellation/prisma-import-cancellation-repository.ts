import { prisma } from "@/lib/infrastructure/prisma/client";
import type { ImportCancellationRepository } from "@/lib/kernel/import-cancellation/import-cancellation-repository";
import type {
  ImportCancellation,
  ImportCancellationIdentity,
  ImportCancellationRequest,
} from "@/lib/kernel/import-cancellation/types";

type RecordType = Awaited<
  ReturnType<typeof prisma.importCancellation.findUnique>
>;

function toDomain(record: NonNullable<RecordType>): ImportCancellation {
  return {
    id: record.id,
    identity: {
      sourceSystem: record.sourceSystem,
      externalImportId: record.externalImportId,
    },
    requestedAt: record.requestedAt,
    cancelledAt: record.cancelledAt,
    reason: record.reason,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class PrismaImportCancellationRepository
  implements ImportCancellationRepository
{
  async request(
    input: ImportCancellationRequest
  ): Promise<ImportCancellation> {
    const record = await prisma.importCancellation.upsert({
      where: {
        sourceSystem_externalImportId: {
          sourceSystem: input.identity.sourceSystem,
          externalImportId: input.identity.externalImportId,
        },
      },
      create: {
        id: input.id,
        sourceSystem: input.identity.sourceSystem,
        externalImportId: input.identity.externalImportId,
        requestedAt: input.requestedAt ?? new Date(),
        reason: input.reason ?? null,
      },
      update: {
        requestedAt: input.requestedAt ?? new Date(),
        reason: input.reason ?? null,
      },
    });

    return toDomain(record);
  }

  async findByIdentity(
    identity: ImportCancellationIdentity
  ): Promise<ImportCancellation | null> {
    const record = await prisma.importCancellation.findUnique({
      where: {
        sourceSystem_externalImportId: {
          sourceSystem: identity.sourceSystem,
          externalImportId: identity.externalImportId,
        },
      },
    });

    return record ? toDomain(record) : null;
  }

  async cancel(
    identity: ImportCancellationIdentity,
    cancelledAt = new Date()
  ): Promise<ImportCancellation | null> {
    const existing = await this.findByIdentity(identity);

    if (!existing) {
      return null;
    }

    const record = await prisma.importCancellation.update({
      where: { id: existing.id },
      data: {
        cancelledAt,
      },
    });

    return toDomain(record);
  }
}
