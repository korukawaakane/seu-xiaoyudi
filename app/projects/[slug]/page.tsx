import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { AchievementCard } from "@/src/components/cards/AchievementCard";
import { PersonCard } from "@/src/components/cards/PersonCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { ProjectMeta } from "@/src/components/sections/ProjectMeta";
import { Timeline } from "@/src/components/sections/Timeline";
import { AnchorNav } from "@/src/components/ui/AnchorNav";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { SourceList } from "@/src/components/ui/SourceList";
import { Tag } from "@/src/components/ui/Tag";
import {
  getAchievementsByProject,
  getPeopleByProject,
  getProjectAccent,
  getProjectBySlug,
  getProjects,
  getStoriesByProject,
  getTeamMembersByProject,
} from "@/src/lib/content";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

const projectAnchors = [
  { id: "overview", label: "专题概况" },
  { id: "people", label: "英烈档案" },
  { id: "timeline", label: "实践历程" },
  { id: "stories", label: "活动动态" },
  { id: "gallery", label: "影像记录" },
  { id: "achievements", label: "产品展示" },
  { id: "team", label: "团队信息" },
];

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const title = `${project.title}｜SEU“小雨滴”社会实践团`;

  return {
    title: { absolute: title },
    description: project.summary,
    alternates: { canonical: "/projects/" + project.slug },
    openGraph: {
      title,
      description: project.summary,
      url: "/projects/" + project.slug,
      type: "article",
      images: [
        {
          url: "/images/og-image.svg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: ["/images/og-image.svg"],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [relatedPeople, relatedStories, relatedAchievements, teamMembers] = await Promise.all([
    getPeopleByProject(project.id),
    getStoriesByProject(project.id),
    getAchievementsByProject(project.id),
    getTeamMembersByProject(project.id),
  ]);
  const statusLabel =
    project.status === "published"
      ? "当前展示"
      : project.status === "review"
        ? "等待审核"
        : project.status === "archived"
          ? "已归档"
          : "资料整理中";

  return (
    <>
      <section className="hero-band border-b border-line bg-paper">
        <Container className="py-10 sm:py-16">
          <Breadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "实践专题", href: "/projects" },
              { label: project.title },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Tag tone="red">{project.year}年 {project.semester}</Tag>
                <Tag tone="bronze">{project.theme}</Tag>
                <Tag tone="light">{statusLabel}</Tag>
                {project.tags.map((tag) => <Tag key={tag} tone="bronze" value={tag}>{tag}</Tag>)}
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">{project.title}</h1>
              <p className="mt-4 text-sm font-semibold text-brand">{project.slogan}</p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{project.summary}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted">
                <MapPin aria-hidden="true" size={16} />
                {project.location}
              </p>
              <Link className="btn-secondary mt-7" href="/projects">
                <ArrowLeft aria-hidden="true" size={18} />
                返回实践专题
              </Link>
            </div>
            <div className="border-t-4 pt-4" style={{ borderTopColor: getProjectAccent(project.themeColor) }}>
              <ImagePlaceholder
                alt={project.title + "项目封面占位"}
                className="aspect-[16/10] min-h-0"
                label="项目封面首屏"
                src={project.coverImage}
                type="project"
              />
            </div>
          </div>
        </Container>
      </section>

      <AnchorNav items={projectAnchors} label="专题详情导航" />

      <section className="section-anchor section-space bg-white" id="overview">
        <Container>
          <SectionHeading title="专题概况" description="背景、目的与基础信息集中说明本次实践专题。" />
          <ProjectMeta project={project} />
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink">实践背景</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{project.background ?? "背景说明待补充。"}</p>
            </div>
            <div className="border-l-2 border-brand/35 pl-6">
              <h2 className="font-serif text-2xl font-semibold text-ink">实践目的</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{project.purpose ?? "实践目的待补充。"}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-anchor section-space bg-paper" id="people">
        <Container>
          <SectionHeading title="英烈档案" description="与本次实践专题相关的英烈档案由数据关系自动生成。" />
          {relatedPeople.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {relatedPeople.map((person) => <PersonCard key={person.id} person={person} projectTitle={project.title} />)}
            </div>
          ) : (
            <EmptyState title="英烈档案待补充" description="为专题和档案建立关联后，该区域会自动显示。" />
          )}
        </Container>
      </section>

      <section className="section-anchor section-space bg-white" id="timeline">
        <Container>
          <SectionHeading title="实践历程" description="时间线节点可持续追加日期、地点、状态与简要说明。" />
          <Timeline items={project.timeline} />
        </Container>
      </section>

      <section className="section-anchor section-space bg-paper" id="stories">
        <Container>
          <SectionHeading title="活动动态" description="相关报道和实践日志通过专题关联自动读取。" />
          {relatedStories.length ? (
            <div className="grid gap-1">
              {relatedStories.map((story) => <StoryCard compact key={story.id} projectTitle={project.title} story={story} />)}
            </div>
          ) : (
            <EmptyState title="活动动态待补充" description="新增并关联动态后，该区域会自动更新。" />
          )}
        </Container>
      </section>

      <section className="section-anchor section-space bg-white" id="gallery">
        <Container>
          <SectionHeading title="影像记录" description="影像资料使用本地占位资源，可直接替换为经过授权的实践图片。" />
          <GalleryGrid images={project.gallery} />
        </Container>
      </section>

      <section className="section-anchor section-space bg-paper" id="achievements">
        <Container>
          <SectionHeading title="产品展示" description="课程、折页、视频和报告等产品统一在这里展示。" />
          {relatedAchievements.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedAchievements.map((achievement) => (
                <AchievementCard achievement={achievement} key={achievement.id} projectTitle={project.title} />
              ))}
            </div>
          ) : (
            <EmptyState title="实践产品待补充" description="关联产品条目后，该区域会自动展示对应内容。" />
          )}
        </Container>
      </section>

      <section className="section-anchor section-space bg-white" id="team">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading title="团队感悟" description="用于记录项目结束后的团队总结。" />
              {(project.reflections ?? []).length ? (
                <div className="grid gap-3">
                  {(project.reflections ?? []).map((reflection) => (
                    <blockquote className="quote-panel" key={reflection}>{reflection}</blockquote>
                  ))}
                </div>
              ) : (
                <EmptyState title="团队感悟待补充" description="项目完成后可在数据文件中追加团队总结。" />
              )}
            </div>
            <div>
              <SectionHeading title="团队成员与分工" description="当前仅使用占位成员，不填写真实团队资料。" />
              {teamMembers.length ? (
                <div className="grid gap-3">
                  {teamMembers.map((member) => (
                    <article className="border-l-2 border-bronze bg-paper p-5" key={member.id}>
                      <p className="font-semibold text-ink">{member.name}</p>
                      <p className="mt-1 text-sm text-brand">{member.role}</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{member.description}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="团队成员待补充" description="后续可在项目数据中增加成员占位或正式资料。" />
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading title="资料来源" description="后续替换真实资料时，请在项目数据中一并补充来源说明。" />
          <SourceList sources={project.sources} />
        </Container>
      </section>
    </>
  );
}
