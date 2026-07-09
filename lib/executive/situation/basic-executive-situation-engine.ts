import type { ExecutiveSituationEngine } from "./executive-situation-engine";
import type { ExecutiveSituationProvider } from "./executive-situation-provider";
import type {
  ExecutiveSituationInput,
  ExecutiveSituationResult,
} from "./types";

export class BasicExecutiveSituationEngine
  implements ExecutiveSituationEngine
{
  constructor(
    private readonly provider: ExecutiveSituationProvider
  ) {}

  async interpret(
    input: ExecutiveSituationInput
  ): Promise<ExecutiveSituationResult> {
    return this.provider.interpret(input);
  }
}
