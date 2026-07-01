import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
}

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium tracking-wide text-zinc-400 uppercase">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className="text-5xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {value}
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}