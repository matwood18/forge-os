// lib/kernel/semantic-events/semantic-event-types.ts
export const SEMANTIC_EVENT_TYPES = {
  ATTRIBUTE_OBSERVED: "attribute.observed",
  CONCERN_DETECTED: "concern.detected",
  DEADLINE_DETECTED: "deadline.detected",
  LOCATION_OBSERVED: "location.observed",
  MEETING_REFERENCED: "meeting.referenced",
  ORGANIZATION_MENTIONED: "organization.mentioned",
  PERSON_MENTIONED: "person.mentioned",
  PREFERENCE_OBSERVED: "preference.observed",
  PROMISE_MADE: "promise.made",
  QUESTION_ASKED: "question.asked",
  QUESTION_ANSWERED: "question.answered",
  RELATIONSHIP_IMPACT_DETECTED: "relationship_impact.detected",
  REPEATED_FAILURE_MODE_DETECTED: "repeated_failure_mode.detected",
  TASK_COMPLETED: "task.completed",
  TASK_CREATED: "task.created",
  TEMPORAL_REFERENCE_DETECTED: "temporal_reference.detected",
  UNRESOLVED_OBLIGATION_DETECTED: "unresolved_obligation.detected",
} as const;

export type SemanticEventType =
  (typeof SEMANTIC_EVENT_TYPES)[keyof typeof SEMANTIC_EVENT_TYPES];