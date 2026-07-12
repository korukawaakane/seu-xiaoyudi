import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import type { PlaceholderImageType } from "@/src/types";
import { cn } from "@/src/lib/utils";

type ImagePlaceholderProps = {
  type: PlaceholderImageType;
  alt: string;
  label?: string;
  assetId?: string;
  className?: string;
};

const typeLabel: Record<PlaceholderImageType, string> = {
  project: "项目封面",
  person: "人物影像",
  story: "纪实封面",
  gallery: "影像资料",
  achievement: "成果封面",
};

const sourceByType: Record<Exclude<PlaceholderImageType, "gallery">, string> = {
  project: "/images/placeholders/project-cover.svg",
  person: "/images/placeholders/person-portrait.svg",
  story: "/images/placeholders/story-cover.svg",
  achievement: "/images/placeholders/achievement-cover.svg",
};

function getSource(type: PlaceholderImageType, assetId?: string) {
  if (type !== "gallery") return sourceByType[type];
  const total = Array.from(assetId ?? "gallery").reduce(
    (value, character) => value + character.charCodeAt(0),
    0,
  );
  return "/images/placeholders/gallery-image-" + ((total % 3) + 1) + ".svg";
}

export function ImagePlaceholder({
  type,
  alt,
  label,
  assetId,
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      aria-label={alt}
      className={cn(
        "image-placeholder group relative flex min-h-40 w-full min-w-0 max-w-full overflow-hidden rounded-[8px] border border-line bg-paper",
        className,
      )}
      role="img"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        fill
        loading="lazy"
        src={getSource(type, assetId)}
        unoptimized
      />
      <div className="absolute inset-0 bg-ink/5" />
      <div className="relative z-10 flex w-full items-end justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold text-brand">{typeLabel[type]}</p>
          <p className="mt-1 text-sm font-medium text-ink">{label ?? "本地占位影像"}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-brand/20 bg-white/80 text-brand">
          <ImageIcon aria-hidden="true" size={18} />
        </span>
      </div>
    </div>
  );
}
