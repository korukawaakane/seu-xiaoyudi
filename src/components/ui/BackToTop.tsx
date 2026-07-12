"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 420);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="返回顶部"
      className="icon-button border-white/25 bg-white/10 text-white hover:bg-white hover:text-brand"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="返回顶部"
      type="button"
    >
      <ArrowUp aria-hidden="true" size={16} />
    </button>
  );
}
