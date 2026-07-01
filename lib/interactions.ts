import { Interaction } from "@/types/interaction"

export const interactions: Interaction[] = [
  {
    id: "int-001",
    personSlug: "jay-n-jax",
    source: "youtube",
    direction: "incoming",
    subject: "First impressions video",
    body:
      "Installed a Polydigm tip on a Predator Revo, posted first impressions, then uploaded two break-and-run videos after several hours of play.",
    createdAt: "2026-07-01",
    tags: ["review", "video", "installation", "break-and-run"],
    sentiment: "positive",
  },

  {
    id: "int-002",
    personSlug: "elliot",
    source: "reddit",
    direction: "incoming",
    subject: "95A hand installation review",
    body:
      "Installed the 95A without a lathe. Reported excellent chalk retention, good playability, and provided detailed installation feedback.",
    createdAt: "2026-07-01",
    tags: ["95A", "installation", "feedback"],
    sentiment: "positive",
  },

  {
    id: "int-003",
    personSlug: "doug",
    source: "facebook",
    direction: "incoming",
    subject: "Hardness comparison",
    body:
      "Compared the 95A against hard leather tips and discussed overall feel and consistency.",
    createdAt: "2026-06-29",
    tags: ["hardness", "comparison"],
    sentiment: "positive",
  },
]