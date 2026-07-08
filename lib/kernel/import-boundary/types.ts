export type ImportBoundaryLimits = {
  maxDiscoveryPages: number;
  maxRecordsPerPage: number;
  maxProcessingBatchSize: number;
};

export type ImportBoundaryDecision = {
  allowed: boolean;
  discoveryPagesRemaining: number;
  processingBatchSize: number;
};

export type ImportBoundaryRequest = {
  discoveredPages: number;
  pendingRecords: number;
};
