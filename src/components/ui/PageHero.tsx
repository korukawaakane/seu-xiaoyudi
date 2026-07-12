import type { ReactNode } from "react";
import { Container } from "@/src/components/ui/Container";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="border-b border-line bg-paper">
      <Container className="py-16 sm:py-20">
        <div className="max-w-4xl">
          {eyebrow ? (
            <p className="mb-4 text-sm font-semibold text-brand">{eyebrow}</p>
          ) : null}
          <h1 className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted sm:text-lg">
            {description}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
