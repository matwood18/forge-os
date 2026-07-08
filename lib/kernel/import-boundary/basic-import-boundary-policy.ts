import type { ImportBoundaryPolicy } from "./import-boundary-policy";
import type {
  ImportBoundaryDecision,
  ImportBoundaryLimits,
  ImportBoundaryRequest,
} from "./types";

export class BasicImportBoundaryPolicy
  implements ImportBoundaryPolicy
{
  constructor(
    private readonly limits: ImportBoundaryLimits
  ) {}

  evaluate(
    request: ImportBoundaryRequest
  ): ImportBoundaryDecision {
    const discoveryPagesRemaining =
      Math.max(
        this.limits.maxDiscoveryPages -
          request.discoveredPages,
        0
      );

    const processingBatchSize =
      Math.min(
        this.limits.maxProcessingBatchSize,
        request.pendingRecords
      );

    return {
      allowed:
        discoveryPagesRemaining > 0 &&
        processingBatchSize > 0,
      discoveryPagesRemaining,
      processingBatchSize,
    };
  }
}
