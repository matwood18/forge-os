export type ForgeCommand = {
  id: string;
  label: string;
  shortcut?: string;
  href: string;
};

export const commands: ForgeCommand[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
  },
  {
    id: "inbox",
    label: "Inbox",
    href: "/inbox",
  },
  {
    id: "people",
    label: "People",
    href: "/people",
  },
  {
    id: "tasks",
    label: "Tasks",
    href: "/tasks",
  },
];