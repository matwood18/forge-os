import type {
  EntityCreateInput,
  EntityRecord,
  EntityRepository,
} from "../repositories";

export class EntityService {
  constructor(private readonly entityRepository?: EntityRepository) {}

  remember(entity: EntityCreateInput): Promise<EntityRecord | null> {
    if (!this.entityRepository) {
      return Promise.resolve(null);
    }

    return this.entityRepository.remember(entity);
  }

  all(): Promise<EntityRecord[]> {
    if (!this.entityRepository) {
      return Promise.resolve([]);
    }

    return this.entityRepository.all();
  }
}