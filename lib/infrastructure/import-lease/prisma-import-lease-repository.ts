import { prisma } from "@/lib/infrastructure/prisma/client";
import type { ImportLeaseRepository } from "@/lib/kernel/import-lease/import-lease-repository";
import type {
  ImportLease,
  ImportLeaseAcquireInput,
  ImportLeaseIdentity,
  ImportLeaseReleaseInput,
} from "@/lib/kernel/import-lease/types";

type PersistedImportLease = Awaited<
  ReturnType<typeof prisma.importLease.findUnique>
>;

function toDomain(record: NonNullable<PersistedImportLease>): ImportLease {
  return {
    id: record.id,
    identity: {
      sourceSystem: record.sourceSystem,
      externalImportId: record.externalImportId,
    },
    ownerId: record.ownerId,
    acquiredAt: record.acquiredAt,
    expiresAt: record.expiresAt,
    releasedAt: record.releasedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class PrismaImportLeaseRepository implements ImportLeaseRepository {
  async acquire(input: ImportLeaseAcquireInput): Promise<ImportLease | null> {
    const acquiredAt = input.acquiredAt ?? new Date();

    const existing = await prisma.importLease.findUnique({
      where: {
        sourceSystem_externalImportId: {
          sourceSystem: input.identity.sourceSystem,
          externalImportId: input.identity.externalImportId,
        },
      },
    });

    if (
      existing &&
      existing.releasedAt === null &&
      existing.expiresAt > acquiredAt
    ) {
      return null;
    }

    const record = await prisma.importLease.upsert({
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
        ownerId: input.ownerId,
        acquiredAt,
        expiresAt: input.expiresAt,
        releasedAt: null,
      },
      update: {
        ownerId: input.ownerId,
        acquiredAt,
        expiresAt: input.expiresAt,
        releasedAt: null,
      },
    });

    return toDomain(record);
  }

  async release(input: ImportLeaseReleaseInput): Promise<ImportLease | null> {
    const existing = await prisma.importLease.findUnique({
      where: {
        sourceSystem_externalImportId: {
          sourceSystem: input.identity.sourceSystem,
          externalImportId: input.identity.externalImportId,
        },
      },
    });

    if (!existing || existing.ownerId !== input.ownerId || existing.releasedAt) {
      return null;
    }

    const record = await prisma.importLease.update({
      where: { id: existing.id },
      data: {
        releasedAt: input.releasedAt ?? new Date(),
      },
    });

    return toDomain(record);
  }

  async findByIdentity(
    identity: ImportLeaseIdentity
  ): Promise<ImportLease | null> {
    const record = await prisma.importLease.findUnique({
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
