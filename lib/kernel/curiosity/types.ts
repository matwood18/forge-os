import type { Question } from "@/lib/domain";
import type { ObservationRecord } from "@/lib/kernel/observation";

export type CuriosityInput = {
  observations: ObservationRecord[];
};

export type CuriosityResult = {
  questions: Question[];
};