"use client";

import { cn } from "@/src/lib/utils";

export type AnchorNavItem = {
  id: string;
  label: string;
};

type AnchorNavProps = {
  items: AnchorNavItem[];
  className?: string;
  label?: string;
};

export function AnchorNav({
  items,
  className,
  label = "页面区块导航",
}: AnchorNavProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "anchor-nav border-b border-line bg-white/95 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {items.map((item) => (
          <a
            className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-paper hover:text-brand focus-visible:bg-paper focus-visible:text-brand"
            href={"#" + item.id}
            key={item.id}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
