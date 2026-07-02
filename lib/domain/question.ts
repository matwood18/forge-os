export type QuestionStatus = "open" | "answered" | "dismissed";

export type QuestionType =
  | "identity-resolution"
  | "memory-review"
  | "relationship-context"
  | "attention-priority";

export type QuestionOption = {
  id: string;
  label: string;
  value: string;
};

export interface Question {
  id: string;

  type: QuestionType;

  prompt: string;

  status: QuestionStatus;

  impact: number;

  createdAt: Date;

  answeredAt?: Date;

  options?: QuestionOption[];
}