export const SEMANTIC_EVENT_TYPES = {
  ATTRIBUTE_OBSERVED: "attribute.observed",
  DEADLINE_DETECTED: "deadline.detected",
  LOCATION_OBSERVED: "location.observed",
  MEETING_REFERENCED: "meeting.referenced",
  ORGANIZATION_MENTIONED: "organization.mentioned",
  PERSON_MENTIONED: "person.mentioned",
  PREFERENCE_OBSERVED: "preference.observed",
  PROMISE_MADE: "promise.made",
  QUESTION_ASKED: "question.asked",
  QUESTION_ANSWERED: "question.answered",
  TASK_COMPLETED: "task.completed",
  TASK_CREATED: "task.created",
} as const;

export type SemanticEventType =
  (typeof SEMANTIC_EVENT_TYPES)[keyof typeof SEMANTIC_EVENT_TYPES];