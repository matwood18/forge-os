import type { Question } from "@/lib/domain";
import type { QuestionStore } from "./question-store";

export class InMemoryQuestionStore implements QuestionStore {
  private readonly questions: Question[] = [];

  async add(question: Question): Promise<void> {
    this.questions.push(question);
  }

  async list(): Promise<Question[]> {
    return [...this.questions];
  }

  async clear(): Promise<void> {
    this.questions.length = 0;
  }
}