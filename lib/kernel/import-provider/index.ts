// lib/kernel/import-provider/index.ts
export type { ImportProviderAdapter } from "./import-provider-adapter";
export type { SourceDocumentMapper } from "./source-document-mapper";

export { DeterministicSourceDocumentMapper } from "./source-document-mapper";

export type {
  ExternalSourceRecord,
  ExternalSourceRecordContent,
  ExternalSourceRecordIdentity,
  ExternalSourceRecordParticipant,
  ImportCursor,
  ImportDiscoveryPage,
  ImportDiscoveryRequest,
  ImportProviderBatchPlan,
  ImportProviderContractProofResult,
  SourceDocumentMappingInput,
} from "./types";

export type {
  ImportProviderOrchestrator,
  ImportProviderOrchestratorInput,
  ImportProviderOrchestratorResult,
  ImportProviderPageProcessor,
} from "./import-provider-orchestrator";

export { BasicImportProviderOrchestrator } from "./import-provider-orchestrator";
