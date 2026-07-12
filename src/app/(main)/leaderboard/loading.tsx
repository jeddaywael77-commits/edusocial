export default function Loading() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="h-8 w-1/4 rounded bg-[#1e293b]" />
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-[#1e293b] bg-[#121826] p-3">
            <div className="h-6 w-8 rounded bg-[#1e293b]" />
            <div className="h-4 w-1/3 rounded bg-[#1e293b]" />
            <div className="ml-auto h-4 w-12 rounded bg-[#1e293b]" />
          </div>
        ))}
      </div>
    </div>
  );
}
