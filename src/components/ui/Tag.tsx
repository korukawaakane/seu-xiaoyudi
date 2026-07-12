import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type TagProps = {
  children: ReactNode;
  tone?: "red" | "bronze" | "dark" | "light";
};

export function Tag({ children, tone = "light" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium",
        tone === "red" && "border-brand/15 bg-brand/10 text-brand",
        tone === "bronze" && "border-bronze/20 bg-bronze/10 text-bronze-dark",
        tone === "dark" && "border-ink/20 bg-ink text-white",
        tone === "light" && "border-line bg-paper text-muted",
      )}
    >
      {children}
    </span>
  );
}
