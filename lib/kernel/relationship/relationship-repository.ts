import type {
  RelationshipCreateInput,
  RelationshipRecord,
} from "./types";

export interface RelationshipRepository {
  remember(
    relationship: RelationshipCreateInput
  ): Promise<RelationshipRecord>;

  forSubject(subjectEntityId: string): Promise<RelationshipRecord[]>;

  all(): Promise<RelationshipRecord[]>;
}