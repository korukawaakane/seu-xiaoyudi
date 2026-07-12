import type { GalleryImage } from "@/src/types";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";

type GalleryGridProps = {
  images: GalleryImage[];
};

export function GalleryGrid({ images }: GalleryGridProps) {
  if (!images.length) {
    return (
      <EmptyState
        title="影像资料待补充"
        description="当前项目暂未添加影像条目，后续可在 gallery 数据中补充。"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <figure className="group" key={image.id}>
          <ImagePlaceholder
            alt={image.alt}
            className="aspect-[4/3] min-h-0 transition duration-300 group-hover:-translate-y-1"
            label={image.title}
            type={image.type}
          />
          <figcaption className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-ink">{image.title}</span>
            <Tag tone="bronze">{image.category}</Tag>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
