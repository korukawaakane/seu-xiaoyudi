"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { siteConfig } from "@/src/config/site";
import { navigationItems } from "@/src/data/navigation";
import { MobileMenu } from "@/src/components/layout/MobileMenu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="flex min-w-0 items-center gap-3 text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <span aria-hidden="true" className="raindrop-mark" />
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase text-brand">SEU</span>
            <span className="block truncate text-sm font-semibold sm:text-base">
              {siteConfig.shortName}
            </span>
          </span>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`rounded-[8px] px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-ink hover:bg-white hover:text-brand"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="搜索功能预留"
            className="hidden rounded-[8px] border border-line bg-white p-2 text-ink transition hover:text-brand md:inline-flex"
            type="button"
          >
            <Search aria-hidden="true" size={18} />
          </button>
          <button
            aria-expanded={isOpen}
            aria-label="打开导航菜单"
            className="rounded-[8px] border border-line bg-white p-2 text-ink md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            type="button"
          >
            <Menu aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
      <MobileMenu
        activePath={pathname}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </header>
  );
}
