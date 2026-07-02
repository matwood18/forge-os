import type {
  EntityCreateInput,
  EntityMatchCandidate,
  EntityRecord,
  EntityRepository,
  EntityType,
} from "@/lib/kernel/repositories";
import { prisma } from "./client";

export class PrismaEntityRepository implements EntityRepository {
  async remember(entity: EntityCreateInput): Promise<EntityRecord> {
    return prisma.entity.create({ data: entity });
  }

  async recall(id: string): Promise<EntityRecord | null> {
    return prisma.entity.findUnique({ where: { id } });
  }

  async recallByDisplayName(displayName: string): Promise<EntityRecord | null> {
    return prisma.entity.findFirst({ where: { displayName } });
  }

  async findCandidatesByMention(
    mention: string,
    type?: EntityType
  ): Promise<EntityMatchCandidate[]> {
    const normalized = normalizeName(mention);

    const entities = await prisma.entity.findMany({
      where: type ? { type } : undefined,
    });

    return entities
      .map((entity): EntityMatchCandidate | null => {
        const displayName = normalizeName(entity.displayName);
        const firstWord = normalizeName(entity.displayName.split(" ")[0] ?? "");

        if (displayName === normalized) {
          return {
            entity,
            confidence: 1,
            reason: "Exact display name match.",
          };
        }

        if (firstWord === normalized) {
          return {
            entity,
            confidence: 0.75,
            reason: "First name match.",
          };
        }

        return null;
      })
      .filter((candidate): candidate is EntityMatchCandidate => {
        return candidate !== null;
      })
      .sort((a, b) => b.confidence - a.confidence);
  }

  async all(): Promise<EntityRecord[]> {
    return prisma.entity.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}