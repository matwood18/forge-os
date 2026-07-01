import { interactions } from "@/lib/interactions"

export function getInteractions() {
  return interactions
}

export function getInteractionsForPerson(personSlug: string) {
  return interactions.filter(
    (interaction) => interaction.personSlug === personSlug
  )
}