type StatCardProps = {
  label: string;
  value: number;
  tone?: "default" | "warning";
};

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-card">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone === "warning" ? "text-warning" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
