import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
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
  tone = "light",
  action,
  children,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={dark ? "mb-8 flex flex-col gap-5 border-b border-white/20 pb-5 md:flex-row md:items-end md:justify-between" : "mb-8 flex flex-col gap-5 border-b border-line pb-5 md:flex-row md:items-end md:justify-between"}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className={dark ? "mb-3 text-sm font-semibold tracking-normal text-white/70" : "mb-3 text-sm font-semibold tracking-normal text-brand"}>
            {eyebrow}
          </p>
        ) : null}
        <h2 className={dark ? "font-serif text-2xl font-semibold text-white sm:text-3xl" : "font-serif text-2xl font-semibold text-ink sm:text-3xl"}>
          {title}
        </h2>
        {description ? (
          <p className={dark ? "mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base" : "mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base"}>
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {action ? (
        <Link className={dark ? "action-link-dark" : "action-link"} href={action.href}>
          {action.label}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </div>
  );
}
