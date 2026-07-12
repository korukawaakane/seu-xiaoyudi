import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="面包屑导航" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
              {item.href && !isLast ? (
                <Link className="inline-flex min-h-9 max-w-44 items-center truncate rounded-[8px] transition hover:text-brand focus-visible:bg-paper" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="max-w-48 truncate">{item.label}</span>
              )}
              {!isLast ? <ChevronRight aria-hidden="true" size={14} /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
