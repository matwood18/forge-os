// lib/kernel/source-document/types.ts

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