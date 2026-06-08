import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-white px-6 py-16 text-center shadow-card">
      <h1 className="text-2xl font-bold">Item not found</h1>
      <p className="mt-2 text-slate-500">This inventory item may have been deleted.</p>
      <Link href="/" className="button-primary mt-6">
        Back to inventory
      </Link>
    </div>
  );
}
