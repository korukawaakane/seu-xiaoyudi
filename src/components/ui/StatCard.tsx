type StatCardProps = {
  label: string;
  value: string;
  note?: string;
};

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <div className="rounded-[8px] border border-line bg-white p-5 shadow-soft">
      <p className="font-serif text-3xl font-semibold text-brand">{value}</p>
      <p className="mt-2 text-sm font-semibold text-ink">{label}</p>
      {note ? <p className="mt-2 text-xs leading-6 text-muted">{note}</p> : null}
    </div>
  );
}
