import type { Question } from "@/lib/domain";

export interface QuestionStore {
  add(question: Question): Promise<void>;

  list(): Promise<Question[]>;

  clear(): Promise<void>;
}