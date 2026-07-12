"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { navigationItems } from "@/src/data/navigation";

type MobileMenuProps = {
  isOpen: boolean;
  activePath: string;
  onClose: () => void;
};

export function MobileMenu({ isOpen, activePath, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="border-t border-line bg-paper md:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-ink">站点导航</span>
        <button
          aria-label="关闭导航菜单"
          className="rounded-[8px] border border-line p-2 text-ink"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>
      </div>
      <nav aria-label="移动端导航" className="mx-auto grid max-w-7xl gap-1 px-4 pb-4">
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/" ? activePath === "/" : activePath.startsWith(item.href);
          return (
            <Link
              className={`rounded-[8px] px-3 py-3 text-sm font-medium transition ${
                isActive ? "bg-brand text-white" : "text-ink hover:bg-white"
              }`}
              href={item.href}
              key={item.href}
              onClick={onClose}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
