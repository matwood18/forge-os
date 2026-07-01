"use client";

import { ReactNode } from "react";
import CommandPalette from "@/components/command/command-palette";

type Props = {
  children: ReactNode;
};

export default function AppProviders({ children }: Props) {
  return (
    <>
      <CommandPalette />
      {children}
    </>
  );
}