export type ConversationRole = "operator" | "forge" | "system";

export type ConversationMessage = {
  id: string;
  role: ConversationRole;
  content: string;
  createdAt: Date;
};