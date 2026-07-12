export default function Loading() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="h-8 w-1/4 rounded bg-[#1e293b]" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-[#1e293b] bg-[#121826] p-4">
            <div className="h-10 w-10 rounded-full bg-[#1e293b]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-[#1e293b]" />
              <div className="h-3 w-2/3 rounded bg-[#1e293b]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
