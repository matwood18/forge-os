export type NavigationItem = {
  id: string;
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
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