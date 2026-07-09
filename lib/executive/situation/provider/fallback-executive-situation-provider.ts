import type { ExecutiveSituationProvider } from "../executive-situation-provider";
import type {
  ExecutiveSituationInput,
  ExecutiveSituationResult,
} from "../types";

export class FallbackExecutiveSituationProvider
  implements ExecutiveSituationProvider
{
  constructor(
    private readonly primary: ExecutiveSituationProvider,
    private readonly fallback: ExecutiveSituationProvider
  ) {}

  async interpret(
    input: ExecutiveSituationInput
  ): Promise<ExecutiveSituationResult> {
    try {
      return await this.primary.interpret(input);
    } catch {
      return this.fallback.interpret(input);
    }
  }
}
