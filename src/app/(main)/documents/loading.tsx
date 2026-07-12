export default function Loading() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="h-8 w-1/4 rounded bg-[#1e293b]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-[#1e293b] bg-[#121826] p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-2/3 rounded bg-[#1e293b]" />
              <div className="h-3 w-full rounded bg-[#1e293b]" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#1e293b] bg-[#121826] p-4 space-y-3">
          <div className="h-4 w-1/2 rounded bg-[#1e293b]" />
          <div className="h-3 w-full rounded bg-[#1e293b]" />
        </div>
      </div>
    </div>
  );
}
