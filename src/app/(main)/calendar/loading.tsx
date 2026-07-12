export default function Loading() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="h-8 w-1/4 rounded bg-[#1e293b]" />
      <div className="rounded-xl border border-[#1e293b] bg-[#121826] p-4 space-y-4">
        <div className="h-4 w-1/3 rounded bg-[#1e293b]" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-[#1e293b]" />
          <div className="h-3 w-5/6 rounded bg-[#1e293b]" />
          <div className="h-3 w-4/6 rounded bg-[#1e293b]" />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-[#1e293b]" />
          ))}
        </div>
      </div>
    </div>
  );
}
