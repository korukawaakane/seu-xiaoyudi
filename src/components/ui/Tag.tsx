import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

type TagProps = {
  children: ReactNode;
  tone?: "red" | "bronze" | "dark" | "light";
  value?: string;
  href?: string;
};

export function Tag({ children, tone = "light", value, href }: TagProps) {
  const target = href ?? (value ? "/search?tag=" + encodeURIComponent(value) : undefined);
  const className = cn(
    "inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium",
    target && "transition hover:border-brand hover:bg-white hover:text-brand focus-visible:outline-none",
    tone === "red" && "border-brand/15 bg-brand/10 text-brand",
    tone === "bronze" && "border-bronze/20 bg-bronze/10 text-bronze-dark",
    tone === "dark" && "border-ink/20 bg-ink text-white",
    tone === "light" && "border-line bg-paper text-muted",
  );

  if (target) {
    return <Link className={className} href={target}>{children}</Link>;
  }

  return <span className={className}>{children}</span>;
}
