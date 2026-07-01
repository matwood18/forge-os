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

  async listOpen(): Promise<Question[]> {
    return this.questions.filter((question) => question.status === "open");
  }

  async markAnswered(id: string): Promise<void> {
    const question = this.questions.find((item) => item.id === id);

    if (!question) {
      return;
    }

    question.status = "answered";
    question.answeredAt = new Date();
  }

  async clear(): Promise<void> {
    this.questions.length = 0;
  }
}