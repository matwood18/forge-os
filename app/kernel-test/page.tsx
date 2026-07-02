import Conversation from "@/components/conversation/conversation";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import StatsGrid from "@/components/dashboard/stats-grid";
import { runRelationshipDemo } from "./relationship-demo";

export default async function Home() {
  const relationships = await runRelationshipDemo();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-10">
      <DashboardHeader />

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-white">
          Relationship Engine Demo
        </h2>

        <div className="mt-4 space-y-3">
          {relationships.map((relationship) => (
            <div
              key={relationship.id}
              className="rounded-xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm text-white/70">
                {relationship.subjectEntityId}{" "}
                <span className="font-semibold text-white">
                  {relationship.predicate}
                </span>{" "}
                {relationship.objectEntityId}
              </p>

              <p className="mt-2 text-xs text-white/50">
                Confidence: {relationship.confidence}
              </p>

              <p className="mt-1 text-xs text-white/50">
                Evidence:{" "}
                {relationship.supportingObservationIds.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Conversation />
      <StatsGrid />
    </div>
  );
}