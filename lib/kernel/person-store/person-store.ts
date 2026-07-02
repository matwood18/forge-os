import type { Person } from "@/lib/domain";

export type PersonMatchCandidate = {
  person: Person;
  confidence: number;
  reason: string;
};

export interface PersonStore {
  add(person: Person): Promise<void>;

  list(): Promise<Person[]>;

  find(id: string): Promise<Person | null>;

  findByDisplayName(displayName: string): Promise<Person | null>;

  findByMention(mention: string): Promise<Person | null>;

  findCandidatesByMention(
    mention: string
  ): Promise<PersonMatchCandidate[]>;

  clear(): Promise<void>;
}