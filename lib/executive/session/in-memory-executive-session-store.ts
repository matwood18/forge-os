import fs from "node:fs";
import path from "node:path";

import type { ExecutiveSession, ExecutiveSessionStore } from "./types";

const sessionPath = path.join(process.cwd(), ".forge", "executive-session.json");

export class FileExecutiveSessionStore implements ExecutiveSessionStore {
  replace(session: ExecutiveSession): void {
    fs.mkdirSync(path.dirname(sessionPath), { recursive: true });
    fs.writeFileSync(sessionPath, JSON.stringify(session), "utf8");
  }

  current(): ExecutiveSession | undefined {
    if (!fs.existsSync(sessionPath)) {
      return undefined;
    }

    const raw = fs.readFileSync(sessionPath, "utf8");
    const parsed = JSON.parse(raw) as ExecutiveSession & { createdAt: string };

    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  }

  clear(): void {
    if (fs.existsSync(sessionPath)) {
      fs.unlinkSync(sessionPath);
    }
  }
}

export const executiveSessionStore = new FileExecutiveSessionStore();
