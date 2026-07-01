import type { Observation } from "@/lib/kernel/reasoning";
import type { Question } from "@/lib/domain";

export type CuriosityInput = {
  observations: Observation[];
};

export type CuriosityResult = {
  questions: Question[];
};