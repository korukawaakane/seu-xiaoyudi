"use client";

import { ArrowUp } from "lucide-react";

type BackToTopProps = {
  label?: string;
};

export function BackToTop({ label = "返回顶部" }: BackToTopProps) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-[8px] border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      type="button"
    >
      <ArrowUp aria-hidden="true" size={16} />
      {label}
    </button>
  );
}
