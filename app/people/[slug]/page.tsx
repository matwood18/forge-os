interface PersonPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PersonPage({
  params,
}: PersonPageProps) {
  const { slug } = await params

  return (
    <div className="max-w-7xl p-10">
      <h1 className="text-4xl font-bold tracking-tight">
        {slug}
      </h1>

      <p className="mt-3 text-zinc-400">
        Relationship profile coming soon.
      </p>
    </div>
  )
}