import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type FilterBarProps = {
  children: ReactNode;
  className?: string;
};

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn("mb-6 grid gap-4 rounded-[8px] border border-line bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4", className)}>
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
    <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
    </label>
  );
}
