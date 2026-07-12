import { Download, Eye } from "lucide-react";
import type { Achievement } from "@/src/types";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";
import { formatDate } from "@/src/lib/utils";

type AchievementCardProps = {
  achievement: Achievement;
  projectTitle: string;
};

export function AchievementCard({ achievement, projectTitle }: AchievementCardProps) {
  return (
    <article className="card group">
      <ImagePlaceholder
        alt={`${achievement.title}封面占位`}
        className="aspect-[16/10] min-h-0 transition duration-300 group-hover:-translate-y-1"
        label={achievement.type}
        type="achievement"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        <Tag tone="red">{achievement.type}</Tag>
        <Tag tone="bronze">{achievement.status}</Tag>
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold text-ink">
        {achievement.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted">{achievement.summary}</p>
      <dl className="mt-4 grid gap-2 text-sm text-muted">
        <div>
          <dt className="font-medium text-ink">所属项目</dt>
          <dd>{projectTitle}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink">制作人员</dt>
          <dd>{achievement.creators.join("、")}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink">发布时间</dt>
          <dd>{formatDate(achievement.publishDate)}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button className="btn-disabled" disabled type="button">
          <Eye aria-hidden="true" size={16} />
          资料整理中
        </button>
        <button className="btn-disabled" disabled type="button">
          <Download aria-hidden="true" size={16} />
          暂不下载
        </button>
      </div>
    </article>
  );
}
