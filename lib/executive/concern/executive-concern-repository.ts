import type {
  ExecutiveConcern,
  ExecutiveConcernCreateInput,
  ExecutiveConcernStatus,
  ExecutiveConcernUpdateInput,
} from "./types";

export interface ExecutiveConcernRepository {
  create(input: ExecutiveConcernCreateInput): ExecutiveConcern;
  update(input: ExecutiveConcernUpdateInput): ExecutiveConcern;
  findById(id: string): ExecutiveConcern | undefined;
  list(): ExecutiveConcern[];
  listByStatus(status: ExecutiveConcernStatus): ExecutiveConcern[];
}

