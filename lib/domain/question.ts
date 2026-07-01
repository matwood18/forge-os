export type QuestionStatus = "open" | "answered" | "dismissed";

export type QuestionType =
  | "identity-resolution"
  | "memory-review"
  | "relationship-context"
  | "attention-priority";

export interface Question {
  id: string;

  type: QuestionType;

  prompt: string;

  status: QuestionStatus;

  impact: number;

  createdAt: Date;

  answeredAt?: Date;
}