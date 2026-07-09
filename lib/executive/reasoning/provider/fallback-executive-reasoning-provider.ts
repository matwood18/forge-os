import type { ExecutiveReasoningProvider } from "../executive-reasoning-provider";
import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "../types";

export class FallbackExecutiveReasoningProvider
  implements ExecutiveReasoningProvider
{
  constructor(
    private readonly primary: ExecutiveReasoningProvider,
    private readonly fallback: ExecutiveReasoningProvider
  ) {}

  async reason(
    input: ExecutiveReasoningInput
  ): Promise<ExecutiveReasoningResult> {
    try {
      return await this.primary.reason(input);
    } catch {
      return this.fallback.reason(input);
    }
  }
}
