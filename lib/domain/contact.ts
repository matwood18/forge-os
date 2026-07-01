export type ContactType =
  | "email"
  | "phone"
  | "reddit"
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "website"

export interface Contact {
  id: string

  type: ContactType

  value: string

  verified: boolean

  personId?: string

  organizationId?: string
}