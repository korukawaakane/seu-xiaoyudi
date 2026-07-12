import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  children,
}: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold tracking-normal text-brand">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {action ? (
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-brand" href={action.href}>
          {action.label}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </div>
  );
}
