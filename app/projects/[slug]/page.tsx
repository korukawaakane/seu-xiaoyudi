import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AchievementCard } from "@/src/components/cards/AchievementCard";
import { PersonCard } from "@/src/components/cards/PersonCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { ProjectMeta } from "@/src/components/sections/ProjectMeta";
import { Timeline } from "@/src/components/sections/Timeline";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { Container } from "@/src/components/ui/Container";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { SourceList } from "@/src/components/ui/SourceList";
import { Tag } from "@/src/components/ui/Tag";
import { projects } from "@/src/data/projects";
import {
  getAchievementsByProject,
  getPeopleByProject,
  getProjectBySlug,
  getProjectTitle,
  getStoriesByProject,
} from "@/src/lib/data";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const relatedPeople = getPeopleByProject(project.id);
  const relatedStories = getStoriesByProject(project.id);
  const relatedAchievements = getAchievementsByProject(project.id);

  return (
    <>
      <section className="hero-band border-b border-line bg-paper">
        <Container className="py-12 sm:py-16">
          <Breadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "历届实践", href: "/projects" },
              { label: project.title },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Tag tone="red">
                  {project.year}年 {project.semester}
                </Tag>
                <Tag tone="bronze">{project.theme}</Tag>
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
                {project.summary}
              </p>
              <p className="mt-4 text-sm font-semibold text-brand">
                {project.slogan}
              </p>
            </div>
            <ImagePlaceholder
              alt={`${project.title}项目封面占位`}
              className="aspect-[16/10] min-h-0"
              label="项目封面首屏"
              type="project"
            />
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="项目基本信息" description="基础字段来自项目数据文件，后续可直接替换为真实资料。" />
          <ProjectMeta project={project} />
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading title="实践背景" description={project.background ?? "背景说明待补充。"} />
            </div>
            <div>
              <SectionHeading title="实践目的" description={project.purpose ?? "实践目的待补充。"} />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="相关人物" description="项目关联人物由 personIds 动态生成。" />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {relatedPeople.map((person) => (
              <PersonCard key={person.id} person={person} projectTitle={project.title} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="实践过程时间线" description="时间线节点可按项目持续追加。" />
          <Timeline items={project.timeline} />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="实践纪实文章" description="相关文章由项目关联 storyIds 统一查询。" />
          <div className="grid gap-6 lg:grid-cols-2">
            {relatedStories.map((story) => (
              <StoryCard
                compact
                key={story.id}
                projectTitle={getProjectTitle(story.projectId)}
                story={story}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="影像记录" description="影像记录使用统一占位组件，避免外部图片链接失效。" />
          <GalleryGrid images={project.gallery} />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="实践成果" description="本阶段成果文件处于整理中，不跳转无效链接。" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedAchievements.map((achievement) => (
              <AchievementCard
                achievement={achievement}
                key={achievement.id}
                projectTitle={project.title}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading title="团队感悟" description="用于记录项目结束后的团队总结。" />
              <ul className="grid gap-3">
                {(project.reflections ?? []).map((reflection) => (
                  <li className="rounded-[8px] border border-line bg-white p-4 text-sm leading-7 text-muted" key={reflection}>
                    {reflection}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading title="团队成员与分工" description="当前仅使用占位成员，不填写真实团队资料。" />
              <div className="grid gap-3">
                {project.team.map((member) => (
                  <div className="rounded-[8px] border border-line bg-white p-4" key={member.id}>
                    <p className="font-semibold text-ink">{member.name}</p>
                    <p className="mt-1 text-sm text-brand">{member.role}</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="资料来源" description="后续替换真实资料时，在项目数据中补充来源说明。" />
          <SourceList sources={project.sources} />
          <div className="mt-8">
            <Link className="btn-secondary" href="/projects">
              <ArrowLeft aria-hidden="true" size={18} />
              返回历届实践
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
