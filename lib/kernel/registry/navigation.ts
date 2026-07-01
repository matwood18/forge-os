export type NavigationItemId =
  | "dashboard"
  | "people"
  | "inbox"
  | "tasks"
  | "products"
  | "analytics"
  | "settings";

export type NavigationItem = {
  id: NavigationItemId;
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Home",
    href: "/",
  },
  {
    id: "people",
    label: "People",
    href: "/people",
  },
  {
    id: "inbox",
    label: "Inbox",
    href: "/inbox",
  },
  {
    id: "tasks",
    label: "Tasks",
    href: "/tasks",
  },
  {
    id: "products",
    label: "Products",
    href: "/products",
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
  },
];