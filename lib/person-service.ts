import { people } from "./people"

export function getPeople() {
  return people
}

export function getPerson(slug: string) {
  return people.find((person) => person.slug === slug)
}