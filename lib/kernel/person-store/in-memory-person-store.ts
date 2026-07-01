import type { Person } from "@/lib/domain";
import type { PersonStore } from "./person-store";

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
    return (
      this.people.find(
        (person) =>
          person.displayName.toLowerCase() === displayName.toLowerCase()
      ) ?? null
    );
  }

  async clear(): Promise<void> {
    this.people.length = 0;
  }
}