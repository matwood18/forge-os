export type EntityType =
  | "PERSON"
  | "ORGANIZATION"
  | "PLACE"
  | "PRODUCT"
  | "PROJECT"
  | "UNKNOWN";

export type EntityRecord = {
  id: string;
  type: EntityType;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EntityCreateInput = {
  type: EntityType;
  displayName: string;
};

export type EntityMatchCandidate = {
  entity: EntityRecord;
  confidence: number;
  reason: string;
};

export interface EntityRepository {
  remember(entity: EntityCreateInput): Promise<EntityRecord>;

  recall(id: string): Promise<EntityRecord | null>;

  recallByDisplayName(displayName: string): Promise<EntityRecord | null>;

  findCandidatesByMention(
    mention: string,
    type?: EntityType
  ): Promise<EntityMatchCandidate[]>;

  all(): Promise<EntityRecord[]>;
}