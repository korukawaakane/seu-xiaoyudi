import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { siteConfig } from "@/src/config/site";
import type { Project } from "@/src/types";
import { BrandLogo } from "@/src/components/brand/BrandLogo";
import { RippleDecoration } from "@/src/components/brand/RippleDecoration";
import { Container } from "@/src/components/ui/Container";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";

type HomeHeroProps = {
  project?: Project;
};

export function HomeHero({ project }: HomeHeroProps) {
  if (!project) {
    return (
      <section className="hero-band relative overflow-hidden border-b border-line bg-paper">
        <RippleDecoration />
        <Container className="relative z-10 py-16 sm:py-24">
          <BrandLogo />
          <h1 className="mt-8 max-w-3xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-6xl">
            {siteConfig.siteName}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {siteConfig.slogan}。推荐专题待设置，仍可先浏览已发布的活动动态。
          </p>
          <Link className="btn-primary mt-8" href="/stories">
            查看活动动态
            <Newspaper aria-hidden="true" size={18} />
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="hero-band relative overflow-hidden border-b border-line bg-paper">
      <RippleDecoration />
      <Container className="relative z-10 grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <BrandLogo />
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Tag tone="red">本期实践专题</Tag>
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
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">{project.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href={"/projects/" + project.slug}>
              查看实践专题
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="btn-secondary" href="/stories">
              查看活动动态
              <Newspaper aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>

        <div className="relative">
          <ImagePlaceholder
            alt={project.title + "封面占位"}
            className="aspect-[4/3] min-h-0"
            label="推荐项目封面"
            src={project.coverImage}
            type="project"
          />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-[8px] border border-line bg-white p-3">
              <p className="text-xs text-muted">年份</p>
              <p className="mt-1 font-semibold text-ink">{project.year}</p>
            </div>
            <div className="rounded-[8px] border border-line bg-white p-3">
              <p className="text-xs text-muted">地点</p>
              <p className="mt-1 truncate font-semibold text-ink">{project.location}</p>
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
