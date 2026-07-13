import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Project } from "@/src/types";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const statusLabel =
    project.status === "published"
      ? "当前展示"
      : project.status === "review"
        ? "等待审核"
        : project.status === "archived"
          ? "已归档"
          : "资料整理中";

  return (
    <article className="card group">
      <ImagePlaceholder
        alt={project.title + "封面占位"}
        className="aspect-[16/10] min-h-0"
        label={project.year + "年 " + project.semester}
        src={project.coverImage}
        type="project"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        <Tag tone="red">{project.year}年</Tag>
        <Tag tone="bronze">{project.semester}</Tag>
        <Tag tone="light">{statusLabel}</Tag>
        {project.tags.map((tag) => (
          <Tag key={tag} tone="bronze" value={tag}>{tag}</Tag>
        ))}
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold text-ink">{project.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{project.summary}</p>
      <div className="mt-4 flex items-center gap-2 text-sm text-muted">
        <MapPin aria-hidden="true" size={16} />
        <span>{project.location}</span>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-2 border-y border-line py-4 text-center text-xs">
        <div>
          <dt className="text-muted">人物</dt>
          <dd className="mt-1 font-semibold text-ink">{project.personIds.length}</dd>
        </div>
        <div>
          <dt className="text-muted">纪实</dt>
          <dd className="mt-1 font-semibold text-ink">{project.storyIds.length}</dd>
        </div>
        <div>
          <dt className="text-muted">成果</dt>
          <dd className="mt-1 font-semibold text-ink">{project.achievementIds.length}</dd>
        </div>
      </dl>
      <Link className="action-link mt-5" href={"/projects/" + project.slug}>
        查看项目
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}
