import type { ReactNode } from "react";

type FilterBarProps = {
  children: ReactNode;
};

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="mb-8 grid gap-4 rounded-[8px] border border-line bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

type FilterFieldProps = {
  label: string;
  children: ReactNode;
};

export function FilterField({ label, children }: FilterFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
    </label>
  );
}
