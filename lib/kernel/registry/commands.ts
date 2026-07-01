import { navigationItems } from "./navigation";

export type ForgeCommand = {
  id: string;
  label: string;
  shortcut?: string;
  href: string;
};

export const commands: ForgeCommand[] = navigationItems.map((item) => ({
  id: item.id,
  label: item.label,
  href: item.href,
}));