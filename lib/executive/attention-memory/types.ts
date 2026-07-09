export type ExecutiveAttentionMemoryState =
  | "surfaced"
  | "quiet"
  | "reconsider";

export type ExecutiveAttentionMemoryRecord = {
  id: string;
  subjectKey: string;
  state: ExecutiveAttentionMemoryState;
  createdAt: Date;
  updatedAt: Date;
};
