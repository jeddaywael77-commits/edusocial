import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080B16] p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B82F6]/10">
          <span className="text-3xl font-bold text-[#3B82F6]">404</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Page not found</h1>
          <p className="text-sm text-gray-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
