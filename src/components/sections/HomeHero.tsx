import Link from "next/link";
import { ArrowRight, Archive } from "lucide-react";
import { siteConfig } from "@/src/config/site";
import type { Project } from "@/src/types";
import { Container } from "@/src/components/ui/Container";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";

type HomeHeroProps = {
  project: Project;
};

export function HomeHero({ project }: HomeHeroProps) {
  return (
    <section className="hero-band border-b border-line bg-paper">
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="red">{siteConfig.teamName}</Tag>
            <Tag tone="bronze">
              {project.year}年 {project.semester}
            </Tag>
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            {project.slogan ?? siteConfig.slogan}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            {siteConfig.subtitle}，用于持续收录历届实践项目、人物档案、纪实文章、影像资料与实践成果。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href={`/projects/${project.slug}`}>
              进入本期实践
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="btn-secondary" href="/projects">
              浏览历届项目
              <Archive aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>

        <div className="relative">
          <ImagePlaceholder
            alt={`${project.title}封面占位`}
            className="aspect-[4/3] min-h-0"
            label="项目封面占位"
            type="project"
          />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-[8px] border border-line bg-white p-3">
              <p className="text-xs text-muted">年份</p>
              <p className="mt-1 font-semibold text-ink">{project.year}</p>
            </div>
            <div className="rounded-[8px] border border-line bg-white p-3">
              <p className="text-xs text-muted">人物</p>
              <p className="mt-1 font-semibold text-ink">{project.personIds.length}</p>
            </div>
            <div className="rounded-[8px] border border-line bg-white p-3">
              <p className="text-xs text-muted">成果</p>
              <p className="mt-1 font-semibold text-ink">{project.achievementIds.length}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
