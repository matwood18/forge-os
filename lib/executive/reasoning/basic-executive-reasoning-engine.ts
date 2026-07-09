import type { ExecutiveReasoningProvider } from "./executive-reasoning-provider";
import type { ExecutiveReasoningEngine } from "./executive-reasoning-engine";
import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "./types";

export class BasicExecutiveReasoningEngine
  implements ExecutiveReasoningEngine
{
  constructor(
    private readonly provider: ExecutiveReasoningProvider
  ) {}

  async reason(
    input: ExecutiveReasoningInput
  ): Promise<ExecutiveReasoningResult> {
    return this.provider.reason(input);
  }
}
