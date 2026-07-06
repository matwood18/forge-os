import type { ArgumentGenerator } from "./argument-generator";
import type { ArgumentGeneratorRegistry } from "./argument-generator-registry";
import type { ReasoningContext } from "./reasoning-context";
import type { CandidateArgument } from "./types";

export class InMemoryArgumentGeneratorRegistry
  implements ArgumentGeneratorRegistry
{
  private readonly generators: ArgumentGenerator[] = [];

  register(generator: ArgumentGenerator): void {
    this.generators.push(generator);
  }

  all(): ArgumentGenerator[] {
    return [...this.generators];
  }

  async generate(context: ReasoningContext): Promise<CandidateArgument[]> {
    const candidates: CandidateArgument[] = [];

    for (const generator of this.generators) {
      const generated = await generator.generate(context);

      candidates.push(...generated);
    }

    return candidates;
  }
}