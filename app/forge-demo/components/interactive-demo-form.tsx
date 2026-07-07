// app/forge-demo/components/interactive-demo-form.tsx
type InteractiveDemoFormProps = {
  initialInput: string;
  errorMessage?: string;
};

export function InteractiveDemoForm({
  initialInput,
  errorMessage,
}: InteractiveDemoFormProps) {
  return (
    <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <form className="flex flex-col gap-3" method="get">
        <div>
          <h2 className="text-sm font-semibold text-slate-300">
            Try your own input
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Type a real note and Forge will run it through the same kernel path
            as the demo scenario.
          </p>
        </div>

        <textarea
          className="min-h-28 rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 outline-none transition focus:border-slate-500"
          defaultValue={initialInput}
          name="input"
          placeholder="Example: I promised to call the insurance company tomorrow, but I keep forgetting."
        />

        {errorMessage ? (
          <p className="text-sm text-red-300">{errorMessage}</p>
        ) : null}

        <button
          className="w-fit rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400"
          type="submit"
        >
          Run Forge
        </button>
      </form>
    </section>
  );
}