import { PrismaClient } from "@prisma/client";

import type {
  EntityCreateInput,
  EntityRecord,
  EntityRepository,
} from "@/lib/kernel/repositories";

const prisma = new PrismaClient();

export class PrismaEntityRepository implements EntityRepository {
  async remember(entity: EntityCreateInput): Promise<EntityRecord> {
    return prisma.entity.create({
      data: entity,
    });
  }

  async recall(id: string): Promise<EntityRecord | null> {
    return prisma.entity.findUnique({
      where: { id },
    });
  }

  async recallByDisplayName(
    displayName: string
  ): Promise<EntityRecord | null> {
    return prisma.entity.findFirst({
      where: {
        displayName,
      },
    });
  }

  async all(): Promise<EntityRecord[]> {
    return prisma.entity.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}