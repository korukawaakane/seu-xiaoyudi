import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { Story } from "@/src/types";
import { formatDate } from "@/src/lib/utils";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";

type StoryCardProps = {
  story: Story;
  projectTitle: string;
  compact?: boolean;
};

export function StoryCard({ story, projectTitle, compact = false }: StoryCardProps) {
  return (
    <article className={compact ? "news-row" : "card group"}>
      {!compact ? (
        <ImagePlaceholder
          alt={story.title + "封面占位"}
          className="aspect-[16/9] min-h-0"
          label={story.category}
          type="story"
        />
      ) : (
        <div className="text-sm">
          <p className="font-serif text-2xl font-semibold leading-none text-brand">
            {formatDate(story.date).replace(/\//g, ".")}
          </p>
          <p className="mt-2 text-xs text-muted">{story.category}</p>
        </div>
      )}
      <div className={compact ? "min-w-0" : "mt-5"}>
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="red">{story.category}</Tag>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <CalendarDays aria-hidden="true" size={14} />
            {formatDate(story.date)}
          </span>
        </div>
        <h2 className="mt-3 font-serif text-xl font-semibold text-ink">{story.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted">{story.summary}</p>
        <p className="mt-3 text-xs font-medium text-muted">所属项目：{projectTitle}</p>
        <Link className="action-link mt-4" href={"/stories/" + story.slug}>
          查看详情
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </article>
  );
}
