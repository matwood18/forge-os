export type RelationshipPredicate =
  | "works_for"
  | "lives_in"
  | "married_to"
  | "reports_to"
  | "collaborates_with"
  | "owns";

export type RelationshipRecord = {
  id: string;

  subjectEntityId: string;

  predicate: RelationshipPredicate;

  objectEntityId: string;

  confidence: number;

  supportingObservationIds: string[];

  createdAt: Date;

  updatedAt: Date;
};

export type RelationshipCreateInput = Omit<
  RelationshipRecord,
  "id" | "createdAt" | "updatedAt"
>;