import { Image as ImageIcon } from "lucide-react";
import type { PlaceholderImageType } from "@/src/types";
import { cn } from "@/src/lib/utils";

type ImagePlaceholderProps = {
  type: PlaceholderImageType;
  alt: string;
  label?: string;
  className?: string;
};

const typeLabel: Record<PlaceholderImageType, string> = {
  project: "项目封面",
  person: "人物影像",
  story: "纪实封面",
  gallery: "影像资料",
  achievement: "成果封面",
};

export function ImagePlaceholder({
  type,
  alt,
  label,
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      aria-label={alt}
      className={cn(
        "placeholder-surface group relative flex min-h-40 overflow-hidden rounded-[8px] border border-line bg-paper",
        className,
      )}
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(140,29,29,0.18),transparent_28%),linear-gradient(135deg,rgba(245,241,232,0.98),rgba(221,216,207,0.55))]" />
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border border-brand/15" />
      <div className="absolute bottom-0 left-0 h-16 w-full bg-[linear-gradient(90deg,rgba(140,29,29,0.12),rgba(166,124,82,0.16),transparent)]" />
      <div className="relative flex w-full items-end justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold text-brand">{typeLabel[type]}</p>
          <p className="mt-1 text-sm font-medium text-ink">{label ?? "占位影像"}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-brand/20 bg-white/80 text-brand">
          <ImageIcon aria-hidden="true" size={18} />
        </span>
      </div>
    </div>
  );
}
