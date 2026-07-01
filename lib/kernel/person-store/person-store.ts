import type { Person } from "@/lib/domain";

export interface PersonStore {
  add(person: Person): Promise<void>;

  list(): Promise<Person[]>;

  find(id: string): Promise<Person | null>;

  findByDisplayName(displayName: string): Promise<Person | null>;

  clear(): Promise<void>;
}