// lib/kernel/source-document/types.ts
import type { EventIngestInput } from "@/lib/kernel/event-store";

export type SourceDocumentKind =
  | "manual_note"
  | "email"
  | "text_message"
  | "chat_message"
  | "unknown";

export type SourceDocumentParticipant = {
  id: string;
  displayName: string | null;
  address: string | null;
  role: "author" | "recipient" | "cc" | "bcc" | "participant" | "unknown";
};

export type SourceDocumentExternalIdentity = {
  sourceSystem: string;
  externalId: string;
  threadId: string | null;
  conversationId: string | null;
};

export type SourceDocumentContent = {
  text: string;
  contentType: "text/plain" | "text/html" | "unknown";
};

export type SourceDocument = {
  id: string;
  kind: SourceDocumentKind;
  externalIdentity: SourceDocumentExternalIdentity;
  participants: SourceDocumentParticipant[];
  content: SourceDocumentContent;
  occurredAt: Date;
  importedAt: Date;
};

export type SourceDocumentIngestorInput = {
  document: SourceDocument;
};

export type SourceDocumentIngestorStatus = "created" | "existing";

export type SourceDocumentIngestorResult = {
  document: SourceDocument;
  eventInput: EventIngestInput;
  status: SourceDocumentIngestorStatus;
};

export type SourceDocumentBatchIngestorInput = {
  documents: SourceDocument[];
};

export type SourceDocumentBatchIngestorItemResult =
  | {
      status: "fulfilled";
      result: SourceDocumentIngestorResult;
    }
  | {
      status: "rejected";
      document: SourceDocument;
      reason: string;
    };

export type SourceDocumentBatchIngestorResult = {
  results: SourceDocumentBatchIngestorItemResult[];
};
