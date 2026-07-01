import type { Event, Question } from "@/lib/domain";

export type EventIngestInput = {
  source: string;
  type: string;
  occurredAt?: Date;
  payload: unknown;
};

export type EventIngestResult = {
  event: Event;
  questions: Question[];
};