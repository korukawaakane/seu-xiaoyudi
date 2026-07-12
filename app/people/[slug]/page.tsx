import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { Timeline } from "@/src/components/sections/Timeline";
import { AnchorNav } from "@/src/components/ui/AnchorNav";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { SourceList } from "@/src/components/ui/SourceList";
import { Tag } from "@/src/components/ui/Tag";
import { people } from "@/src/data/people";
import {
  getPersonBySlug,
  getProjectById,
  getProjectTitle,
  getStoriesByIds,
} from "@/src/lib/data";
import type { Project } from "@/src/types";

type PersonDetailProps = {
  params: Promise<{ slug: string }>;
};

const peopleAnchors = [
  { id: "profile", label: "人物简介" },
  { id: "timeline", label: "生平时间线" },
  { id: "deeds", label: "主要事迹" },
  { id: "gallery", label: "历史影像" },
  { id: "projects", label: "相关项目" },
  { id: "sources", label: "资料来源" },
];

export function generateStaticParams() {
  return people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: PersonDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) return {};

  return {
    title: person.name + "｜人物档案",
    description: person.summary,
    alternates: { canonical: "/people/" + person.slug },
    openGraph: { title: person.name, description: person.summary, type: "profile" },
  };
}

export default async function PersonDetailPage({ params }: PersonDetailProps) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) notFound();

  const relatedProjects = person.projectIds
    .map((id) => getProjectById(id))
    .filter((project): project is Project => Boolean(project));
  const relatedStories = getStoriesByIds(person.storyIds);

  return (
    <>
      <section className="hero-band border-b border-line bg-paper">
        <Container className="py-10 sm:py-16">
          <Breadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "人物档案", href: "/people" },
              { label: person.name },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <ImagePlaceholder alt={person.name + "人物照片占位"} className="aspect-[3/4] min-h-0 max-w-md" label={person.category} type="person" />
            <div>
              <div className="flex flex-wrap gap-2">
                <Tag tone="red">{person.category}</Tag>
                {person.keywords.map((keyword) => <Tag key={keyword} tone="bronze">{keyword}</Tag>)}
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold text-ink sm:text-5xl">{person.name}</h1>
              <p className="mt-3 text-sm text-muted">{person.years}</p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{person.summary}</p>
              <Link className="btn-secondary mt-7" href="/people">
                <ArrowLeft aria-hidden="true" size={18} />
                返回人物档案
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <AnchorNav items={peopleAnchors} label="人物详情导航" />

      <section className="section-anchor section-space bg-white" id="profile">
        <Container>
          <SectionHeading title="人物简介" description="当前全部为中文占位字段，后续可在人物数据文件中替换为经过确认的资料。" />
          <div className="grid gap-4 border border-line bg-paper p-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["姓名", person.name],
              ["生卒年份", person.years],
              ["籍贯", person.birthplace],
              ["身份", person.identity],
            ].map(([label, item]) => (
              <div key={label}>
                <p className="text-xs font-semibold text-muted">{label}</p>
                <p className="mt-1 font-medium text-ink">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-3xl">
            <p className="prose-panel">{person.biography}</p>
          </div>
        </Container>
      </section>

      <section className="section-anchor section-space bg-paper" id="timeline">
        <Container>
          <SectionHeading title="生平时间线" description="用于展示人物经历节点，数据为空时将显示统一提示。" />
          <Timeline items={person.timeline} />
        </Container>
      </section>

      <section className="section-anchor section-space bg-white" id="deeds">
        <Container>
          <SectionHeading title="主要事迹" description="本阶段仅保留自然中文占位段落，后续可替换为经核实的事迹材料。" />
          {person.deeds.length ? (
            <div className="grid gap-3">
              {person.deeds.map((deed) => <blockquote className="quote-panel" key={deed}>{deed}</blockquote>)}
            </div>
          ) : (
            <EmptyState title="主要事迹待补充" description="后续可在人物数据文件中录入完整内容。" />
          )}
        </Container>
      </section>

      <section className="section-anchor section-space bg-paper" id="gallery">
        <Container>
          <SectionHeading title="历史影像" description="当前使用本地占位影像，后续可替换为经过授权的资料图片。" />
          <GalleryGrid images={person.gallery} />
        </Container>
      </section>

      <section className="section-anchor section-space bg-white" id="projects">
        <Container>
          <SectionHeading title="相关实践项目" description="人物可以关联多个实践项目。" />
          {relatedProjects.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          ) : (
            <EmptyState title="关联项目待补充" description="建立人物与项目关系后，该区域会自动更新。" />
          )}
          {relatedStories.length ? (
            <div className="mt-12">
              <SectionHeading title="相关文章" description="相关纪实文章由人物数据中的关联标识自动读取。" />
              <div className="grid gap-1">
                {relatedStories.map((story) => <StoryCard compact key={story.id} projectTitle={getProjectTitle(story.projectId)} story={story} />)}
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="section-anchor section-space bg-paper" id="sources">
        <Container>
          <SectionHeading title="资料来源" description="没有链接的来源不会渲染为空锚点。" />
          <SourceList sources={person.sources} />
        </Container>
      </section>
    </>
  );
}
