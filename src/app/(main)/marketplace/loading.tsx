export default function Loading() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="h-8 w-1/4 rounded bg-[#1e293b]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#1e293b] bg-[#121826] p-4 space-y-3">
            <div className="aspect-video rounded-lg bg-[#1e293b]" />
            <div className="h-4 w-2/3 rounded bg-[#1e293b]" />
            <div className="h-3 w-full rounded bg-[#1e293b]" />
          </div>
        ))}
      </div>
    </div>
  );
}
