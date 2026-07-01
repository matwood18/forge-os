"use client";

import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search Forge..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem>Dashboard</CommandItem>
          <CommandItem>Inbox</CommandItem>
          <CommandItem>People</CommandItem>
          <CommandItem>Tasks</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}