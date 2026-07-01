import { Person } from "@/types/person"

export const people: Person[] = [
  {
    slug: "jay-n-jax",
    name: "Jay N Jax",
    role: "YouTube Creator",
    platform: "YouTube",
    status: "Active Reviewer",
    lastInteraction: "Today",
    relationshipScore: 86,
    tags: ["Creator", "Reviewer", "Customer"],
    notes:
      "Installed Polydigm tip on Predator Revo and posted break-and-run videos.",
  },
  {
    slug: "elliot",
    name: "Elliot",
    role: "Cue Repair / League Player",
    platform: "Reddit",
    status: "Long-term Tester",
    lastInteraction: "Yesterday",
    relationshipScore: 92,
    tags: ["Installer", "Tester", "Technical Feedback"],
    notes:
      "Installed 95A by hand and gave detailed feedback on chalk retention and installation.",
  },
  {
    slug: "doug",
    name: "Doug",
    role: "Customer",
    platform: "Facebook",
    status: "Early Feedback",
    lastInteraction: "2 Days Ago",
    relationshipScore: 74,
    tags: ["Customer", "Feedback"],
    notes: "Provided early comparison feedback on hardness and feel.",
  },
]