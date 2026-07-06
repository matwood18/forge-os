import type { Question } from "@/lib/domain";

import type { MemoryRecord } from "../memory";
import type { ObservationRecord } from "../observation";
import type { RelationshipRecord } from "../relationship";

export type WorldModel = {
  id: string;

  generatedAt: Date;

  observations: ObservationRecord[];

  relationships: RelationshipRecord[];

  memories: MemoryRecord[];

  openQuestions: Question[];
};