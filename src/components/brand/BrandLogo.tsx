import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { WaterDropMark } from "@/src/components/brand/WaterDropMark";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
  tone?: "light" | "dark";
};

export function BrandLogo({
  className,
  compact = false,
  tone = "light",
}: BrandLogoProps) {
  const textTone = tone === "dark" ? "text-white" : "text-ink";
  const subTone = tone === "dark" ? "text-white/70" : "text-brand";

  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      <WaterDropMark tone={tone} />
      <span className="min-w-0">
        <span className={cn("block text-xs font-semibold uppercase tracking-[0.14em]", subTone)}>
          SEU
        </span>
        <span className={cn("block truncate font-serif text-base font-semibold sm:text-lg", textTone)}>
          {compact ? siteConfig.shortName : siteConfig.teamName}
        </span>
      </span>
    </span>
  );
}
