import type {
  ExecutiveConcern,
  ExecutiveConcernCreateInput,
  ExecutiveConcernStatus,
  ExecutiveConcernUpdateInput,
} from "./types";

export interface ExecutiveConcernRepository {
  create(input: ExecutiveConcernCreateInput): Promise<ExecutiveConcern>;
  update(input: ExecutiveConcernUpdateInput): Promise<ExecutiveConcern>;
  findById(id: string): Promise<ExecutiveConcern | undefined>;
  list(): Promise<ExecutiveConcern[]>;
  listByStatus(status: ExecutiveConcernStatus): Promise<ExecutiveConcern[]>;
  clear(): Promise<void>;
}
