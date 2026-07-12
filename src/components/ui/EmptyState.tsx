import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-[8px] border border-dashed border-line bg-paper p-8 text-center">
      <SearchX aria-hidden="true" className="text-brand" size={32} />
      <h2 className="mt-4 font-serif text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
