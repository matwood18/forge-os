import type {
  ObservationCreateInput,
  ObservationRecord,
  ObservationRepository,
} from "@/lib/kernel/observation/observation-repository";
import { prisma } from "./client";

export class PrismaObservationRepository
  implements ObservationRepository
{
  async remember(
    observation: ObservationCreateInput
  ): Promise<ObservationRecord> {
    return prisma.observation.create({
      data: observation,
    });
  }

  async forSubject(
    subjectEntityId: string
  ): Promise<ObservationRecord[]> {
    return prisma.observation.findMany({
      where: {
        subjectEntityId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async all(): Promise<ObservationRecord[]> {
    return prisma.observation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
