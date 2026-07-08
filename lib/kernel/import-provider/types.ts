// lib/kernel/import-provider/types.ts
import type { SourceDocumentKind } from "@/lib/kernel/source-document";

export type ImportCursor = {
  value: string;
};

export type ImportDiscoveryRequest = {
  sourceSystem: string;
  cursor: ImportCursor | null;
  limit: number;
};

export type ExternalSourceRecordIdentity = {
  sourceSystem: string;
  externalId: string;
  threadId: string | null;
  conversationId: string | null;
};

export type ExternalSourceRecordParticipant = {
  id: string;
  displayName: string | null;
  address: string | null;
  role: "author" | "recipient" | "cc" | "bcc" | "participant" | "unknown";
};

export type ExternalSourceRecordContent = {
  text: string;
  contentType: "text/plain" | "text/html" | "unknown";
};

export type ExternalSourceRecord = {
  identity: ExternalSourceRecordIdentity;
  kind: SourceDocumentKind;
  participants: ExternalSourceRecordParticipant[];
  content: ExternalSourceRecordContent;
  occurredAt: Date;
  importedAt: Date;
};

export type ImportDiscoveryPage = {
  records: ExternalSourceRecord[];
  nextCursor: ImportCursor | null;
  hasMore: boolean;
};

export type SourceDocumentMappingInput = {
  record: ExternalSourceRecord;
};

export type ImportProviderBatchPlan = {
  discoveryLimit: number;
  processingLimit: number;
};

export type ImportProviderContractProofResult = {
  pagesDiscovered: number;
  documentsMapped: number;
  stableDocumentIds: boolean;
  boundedDiscovery: boolean;
};
