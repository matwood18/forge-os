export interface Interaction {
  id: string
  personSlug: string
  source:
    | "reddit"
    | "facebook"
    | "instagram"
    | "youtube"
    | "email"
    | "website"
  direction: "incoming" | "outgoing"
  subject: string
  body: string
  createdAt: string
  tags: string[]
  sentiment: "positive" | "neutral" | "negative"
}