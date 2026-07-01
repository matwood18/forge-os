export type SearchEntityType =
  | "person"
  | "contact"
  | "organization"
  | "workspace"
  | "event"
  | "interpretation"
  | "memory"
  | "relationship"
  | "task"
  | "product";

export type SearchRegistryItem = {
  id: SearchEntityType;
  label: string;
  description: string;
};

export const searchRegistry: SearchRegistryItem[] = [
  {
    id: "person",
    label: "People",
    description: "Search human relationships.",
  },
  {
    id: "contact",
    label: "Contacts",
    description: "Search communication endpoints.",
  },
  {
    id: "organization",
    label: "Organizations",
    description: "Search companies, teams, and entities.",
  },
  {
    id: "workspace",
    label: "Workspaces",
    description: "Search business and life contexts.",
  },
  {
    id: "event",
    label: "Events",
    description: "Search immutable observations.",
  },
  {
    id: "interpretation",
    label: "Interpretations",
    description: "Search current understanding derived from events.",
  },
  {
    id: "memory",
    label: "Memories",
    description: "Search durable understanding.",
  },
  {
    id: "relationship",
    label: "Relationships",
    description: "Search relationship history and context.",
  },
  {
    id: "task",
    label: "Tasks",
    description: "Search intentional actions.",
  },
  {
    id: "product",
    label: "Products",
    description: "Search products and offerings.",
  },
];