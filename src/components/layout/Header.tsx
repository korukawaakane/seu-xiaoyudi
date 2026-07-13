"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/src/components/brand/BrandLogo";
import { navigationItems } from "@/src/data/navigation";
import { MobileMenu } from "@/src/components/layout/MobileMenu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          aria-label="返回首页"
          className="min-w-0 rounded-[8px]"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <BrandLogo compact />
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={isActive
                  ? "rounded-[8px] bg-brand px-3 py-2 text-sm font-medium text-white transition"
                  : "rounded-[8px] px-3 py-2 text-sm font-medium text-ink transition hover:bg-white hover:text-brand"}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "关闭导航菜单" : "打开导航菜单"}
          className="icon-button lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          title={isOpen ? "关闭导航菜单" : "打开导航菜单"}
          type="button"
        >
          {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>
      <MobileMenu
        activePath={pathname}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </header>
  );
}
