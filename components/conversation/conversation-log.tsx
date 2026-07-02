"use client";

type ConversationLogEntry = {
  id: string;
  label: string;
  payload: unknown;
};

type ConversationLogProps = {
  entries: ConversationLogEntry[];
};

export default function ConversationLog({ entries }: ConversationLogProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <details className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <summary className="cursor-pointer text-sm font-medium text-zinc-300">
        Conversation Log
      </summary>

      <div className="mt-4 grid gap-4">
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {entry.label}
            </div>

            <pre className="overflow-auto rounded-lg bg-black/40 p-3 text-xs text-zinc-300">
              {JSON.stringify(entry.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </details>
  );
}

export type { ConversationLogEntry };