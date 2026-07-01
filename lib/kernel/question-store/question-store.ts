import type { Question } from "@/lib/domain";

export interface QuestionStore {
  add(question: Question): Promise<void>;

  list(): Promise<Question[]>;

  listOpen(): Promise<Question[]>;

  markAnswered(id: string): Promise<void>;

  clear(): Promise<void>;
}