import Link from "next/link";
import { siteConfig } from "@/src/config/site";
import { BrandLogo } from "@/src/components/brand/BrandLogo";
import { archiveNavigationItems, navigationItems } from "@/src/data/navigation";
import { BackToTop } from "@/src/components/ui/BackToTop";
import { Container } from "@/src/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandLogo tone="dark" />
            <p className="mt-3 text-sm text-white/70">{siteConfig.subtitle}</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75">
              {siteConfig.slogan}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">页面导航</h2>
            <ul className="mt-4 grid gap-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link className="inline-flex min-h-9 items-center rounded-[8px] text-sm text-white/70 transition hover:text-white focus-visible:bg-white/10" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 border-t border-white/15 pt-5 text-xs font-semibold text-white/55">
              资料索引
            </h3>
            <ul className="mt-3 grid gap-2">
              {archiveNavigationItems.map((item) => (
                <li key={item.href}>
                  <Link className="inline-flex min-h-9 items-center text-sm text-white/70 transition hover:text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">预留信息</h2>
            <ul className="mt-4 grid gap-2 text-sm text-white/70">
              <li>联系方式：待补充</li>
              <li>资料来源说明：待补充</li>
              <li>版权说明：待补充</li>
              <li>网站建设说明：长期维护，持续更新</li>
            </ul>
            <div className="mt-5">
              <BackToTop />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
