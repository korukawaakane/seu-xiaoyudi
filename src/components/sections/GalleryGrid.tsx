"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/src/types";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";

type GalleryGridProps = {
  images: GalleryImage[];
};

export function GalleryGrid({ images }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeImage = activeIndex === null ? undefined : images[activeIndex];

  const close = () => {
    setActiveIndex(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => index === null ? null : (index + 1) % images.length);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length]);

  if (!images.length) {
    return (
      <EmptyState
        title="影像资料待补充"
        description="当前项目暂未添加影像条目，后续可在 gallery 数据中补充。"
      />
    );
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <figure className="group" key={image.id}>
            <button
              aria-label={"放大查看：" + image.title}
              className="block w-full rounded-[8px] text-left"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActiveIndex(index);
              }}
              type="button"
            >
              <ImagePlaceholder
                alt={image.alt}
                assetId={image.id}
                className="aspect-[4/3] min-h-0"
                label={image.title}
                type={image.type}
              />
            </button>
            <figcaption className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-ink">{image.title}</span>
              <Tag tone="bronze">{image.category}</Tag>
            </figcaption>
          </figure>
        ))}
      </div>

      {activeImage ? (
        <div
          aria-labelledby="gallery-lightbox-title"
          aria-modal="true"
          className="lightbox-backdrop fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) close();
          }}
          role="dialog"
        >
          <div className="relative w-full max-w-5xl rounded-[8px] border border-white/20 bg-ink p-3 shadow-2xl sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/65">{activeImage.category}</p>
                <h2 className="truncate font-serif text-lg font-semibold" id="gallery-lightbox-title">
                  {activeImage.title}
                </h2>
              </div>
              <button
                aria-label="关闭影像预览"
                className="icon-button h-10 w-10 border-white/25 bg-white/10 text-white hover:bg-white hover:text-brand"
                onClick={close}
                ref={closeButtonRef}
                title="关闭影像预览"
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <ImagePlaceholder
              alt={activeImage.alt}
              assetId={activeImage.id}
              className="lightbox-image aspect-[16/10] min-h-0 border-white/20"
              label={activeImage.title}
              type={activeImage.type}
            />
            {images.length > 1 ? (
              <>
                <button
                  aria-label="查看上一张影像"
                  className="icon-button absolute left-5 top-1/2 -translate-y-1/2 border-white/25 bg-ink/75 text-white hover:bg-white hover:text-brand"
                  onClick={() => setActiveIndex((index) => index === null ? null : (index - 1 + images.length) % images.length)}
                  title="上一张"
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={20} />
                </button>
                <button
                  aria-label="查看下一张影像"
                  className="icon-button absolute right-5 top-1/2 -translate-y-1/2 border-white/25 bg-ink/75 text-white hover:bg-white hover:text-brand"
                  onClick={() => setActiveIndex((index) => index === null ? null : (index + 1) % images.length)}
                  title="下一张"
                  type="button"
                >
                  <ChevronRight aria-hidden="true" size={20} />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
