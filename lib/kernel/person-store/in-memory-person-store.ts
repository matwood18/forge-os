import type { Person } from "@/lib/domain";
import type { PersonMatchCandidate, PersonStore } from "./person-store";

export class InMemoryPersonStore implements PersonStore {
  private readonly people: Person[] = [];

  async add(person: Person): Promise<void> {
    this.people.push(person);
  }

  async list(): Promise<Person[]> {
    return [...this.people];
  }

  async find(id: string): Promise<Person | null> {
    return this.people.find((person) => person.id === id) ?? null;
  }

  async findByDisplayName(displayName: string): Promise<Person | null> {
    const normalized = normalizeName(displayName);

    return (
      this.people.find(
        (person) => normalizeName(person.displayName) === normalized
      ) ?? null
    );
  }

  async findByMention(mention: string): Promise<Person | null> {
    const candidates = await this.findCandidatesByMention(mention);

    const confidentCandidate = candidates.find(
      (candidate) => candidate.confidence >= 0.95
    );

    return confidentCandidate?.person ?? null;
  }

  async findCandidatesByMention(
    mention: string
  ): Promise<PersonMatchCandidate[]> {
    const normalized = normalizeName(mention);

    return this.people
      .map((person): PersonMatchCandidate | null => {
        const displayName = normalizeName(person.displayName);
        const firstName = normalizeName(person.firstName);

        if (displayName === normalized) {
          return {
            person,
            confidence: 1,
            reason: "Exact display name match.",
          };
        }

        if (firstName === normalized) {
          return {
            person,
            confidence: 0.75,
            reason: "First name match only.",
          };
        }

        return null;
      })
      .filter((candidate): candidate is PersonMatchCandidate => {
        return candidate !== null;
      })
      .sort((a, b) => b.confidence - a.confidence);
  }

  async clear(): Promise<void> {
    this.people.length = 0;
  }
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}