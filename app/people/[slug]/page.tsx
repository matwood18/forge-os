import { notFound } from "next/navigation";

import { ObservationRenderer } from "@/components/observations/observation-renderer";
import {
  PrismaEntityRepository,
  PrismaObservationRepository,
} from "@/lib/infrastructure/prisma";

interface PersonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { slug } = await params;

  const entityRepository = new PrismaEntityRepository();
  const observationRepository = new PrismaObservationRepository();

  const person = await entityRepository.recall(slug);

  if (!person) {
    notFound();
  }

  const observations = await observationRepository.forSubject(person.id);

  return (
    <div className="max-w-7xl p-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-amber-400">
          {person.type}
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          {person.displayName}
        </h1>

        <p className="mt-2 text-zinc-400">
          Known since {person.createdAt.toLocaleDateString()}
        </p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Entity Type
          </h2>

          <p className="mt-3 text-2xl font-bold">{person.type}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Observations
          </h2>

          <p className="mt-3 font-mono text-5xl font-bold">
            {observations.length}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Last Updated
          </h2>

          <p className="mt-3 text-2xl font-bold">
            {person.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Memory Timeline
        </h2>

        <ObservationRenderer observations={observations} />
      </section>
    </div>
  );
}