import type { Person } from "@/lib/domain";
import type { PersonStore } from "@/lib/kernel/person-store";

import type {
  IdentityResolutionAnswer,
  IdentityResolutionEngine,
  IdentityResolutionEngineResult,
} from "./identity-resolution-engine";

export class BasicIdentityResolutionEngine implements IdentityResolutionEngine {
  constructor(private readonly personStore: PersonStore) {}

  async answer(
    input: IdentityResolutionAnswer
  ): Promise<IdentityResolutionEngineResult> {
    const existingPerson = await this.personStore.findByDisplayName(
      input.displayName
    );

    if (existingPerson) {
      return {
        personId: existingPerson.id,
        displayName: existingPerson.displayName,
      };
    }

    const person = this.createPerson(input.displayName);

    await this.personStore.add(person);

    return {
      personId: person.id,
      displayName: person.displayName,
    };
  }

  private createPerson(displayName: string): Person {
    const parts = displayName.trim().split(" ");
    const firstName = parts[0] ?? displayName;
    const lastName = parts.slice(1).join(" ");

    const now = new Date();

    return {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      displayName,
      createdAt: now,
      updatedAt: now,
    };
  }
}