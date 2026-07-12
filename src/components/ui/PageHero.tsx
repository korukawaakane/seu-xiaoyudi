import type { ReactNode } from "react";
import { RippleDecoration } from "@/src/components/brand/RippleDecoration";
import { Container } from "@/src/components/ui/Container";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  stat?: {
    label: string;
    value: string;
  };
  tone?: "light" | "dark";
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  stat,
  tone = "light",
  children,
}: PageHeroProps) {
  const dark = tone === "dark";
  return (
    <section className={dark ? "relative overflow-hidden bg-ink text-white" : "hero-band relative overflow-hidden border-b border-line bg-paper"}>
      <RippleDecoration tone={dark ? "light" : "brand"} />
      <Container className="relative z-10 py-16 sm:py-20">
        <div className="max-w-4xl">
          {eyebrow ? (
            <p className={dark ? "mb-4 text-sm font-semibold text-white/70" : "mb-4 text-sm font-semibold text-brand"}>{eyebrow}</p>
          ) : null}
          <h1 className={dark ? "font-serif text-3xl font-semibold leading-tight text-white sm:text-5xl" : "font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl"}>
            {title}
          </h1>
          <p className={dark ? "mt-5 max-w-3xl text-base leading-8 text-white/75 sm:text-lg" : "mt-5 max-w-3xl text-base leading-8 text-muted sm:text-lg"}>
            {description}
          </p>
          {stat ? (
            <div className={dark ? "mt-8 inline-flex items-baseline gap-3 border-l border-white/30 pl-4" : "mt-8 inline-flex items-baseline gap-3 border-l border-brand/35 pl-4"}>
              <span className={dark ? "font-serif text-4xl font-semibold text-white" : "font-serif text-4xl font-semibold text-brand"}>
                {stat.value}
              </span>
              <span className={dark ? "text-sm text-white/70" : "text-sm text-muted"}>{stat.label}</span>
            </div>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
