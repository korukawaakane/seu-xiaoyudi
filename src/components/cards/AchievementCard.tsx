import { BookOpen, Camera, Download, Eye, FileText, Image, Presentation, Video } from "lucide-react";
import type { Achievement, AchievementType } from "@/src/types";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";
import { formatDate } from "@/src/lib/utils";

type AchievementCardProps = {
  achievement: Achievement;
  projectTitle: string;
};

const achievementIcons: Record<AchievementType, typeof FileText> = {
  调研报告: FileText,
  展示文稿: Presentation,
  视频作品: Video,
  宣传海报: Image,
  摄影作品: Camera,
  实践心得: BookOpen,
  电子手册: BookOpen,
};

export function AchievementCard({ achievement, projectTitle }: AchievementCardProps) {
  const TypeIcon = achievementIcons[achievement.type];
  const hasPreview = Boolean(achievement.previewUrl);
  const hasFile = Boolean(achievement.fileUrl);

  return (
    <article className="card group">
      <ImagePlaceholder
        alt={achievement.title + "封面占位"}
        className="aspect-[16/10] min-h-0"
        label={achievement.type}
        type="achievement"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        <Tag tone="red">
          <TypeIcon aria-hidden="true" className="mr-1" size={14} />
          {achievement.type}
        </Tag>
        <Tag tone="bronze">{achievement.status}</Tag>
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold text-ink">{achievement.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{achievement.summary}</p>
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
        {hasPreview ? (
          <a className="btn-secondary" href={achievement.previewUrl} rel="noreferrer" target="_blank">
            <Eye aria-hidden="true" size={16} />
            预览资料
          </a>
        ) : (
          <span aria-disabled="true" className="btn-disabled">
            <Eye aria-hidden="true" size={16} />
            资料整理中
          </span>
        )}
        {hasFile ? (
          <a className="btn-secondary" href={achievement.fileUrl} rel="noreferrer" target="_blank">
            <Download aria-hidden="true" size={16} />
            下载资料
          </a>
        ) : (
          <span aria-disabled="true" className="btn-disabled">
            <Download aria-hidden="true" size={16} />
            暂无文件
          </span>
        )}
      </div>
    </article>
  );
}
