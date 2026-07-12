import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { Timeline } from "@/src/components/sections/Timeline";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { Container } from "@/src/components/ui/Container";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { SourceList } from "@/src/components/ui/SourceList";
import { Tag } from "@/src/components/ui/Tag";
import { people } from "@/src/data/people";
import { getPersonBySlug, getProjectById, getProjectTitle, getStoryBySlug } from "@/src/lib/data";

type PersonDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({
  params,
}: PersonDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) return {};

  return {
    title: person.name,
    description: person.summary,
  };
}

export default async function PersonDetailPage({ params }: PersonDetailProps) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) notFound();

  const relatedProjects = person.projectIds
    .map((id) => getProjectById(id))
    .filter((project) => Boolean(project));
  const relatedStories = person.storyIds
    .map((id) => getStoryBySlug(id))
    .filter((story) => Boolean(story));

  return (
    <>
      <section className="hero-band border-b border-line bg-paper">
        <Container className="py-12 sm:py-16">
          <Breadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "人物档案", href: "/people" },
              { label: person.name },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <ImagePlaceholder
              alt={`${person.name}人物照片占位`}
              className="aspect-[3/4] min-h-0 max-w-md"
              label={person.category}
              type="person"
            />
            <div>
              <div className="flex flex-wrap gap-2">
                <Tag tone="red">{person.category}</Tag>
                {person.keywords.map((keyword) => (
                  <Tag key={keyword} tone="bronze">
                    {keyword}
                  </Tag>
                ))}
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold text-ink sm:text-5xl">
                {person.name}
              </h1>
              <p className="mt-3 text-sm text-muted">{person.years}</p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
                {person.summary}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="基本信息" description="当前全部为占位字段，后续在人物数据文件中替换。" />
          <div className="grid gap-4 rounded-[8px] border border-line bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["姓名", person.name],
              ["生卒年份", person.years],
              ["籍贯", person.birthplace],
              ["身份", person.identity],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold text-muted">{label}</p>
                <p className="mt-1 font-medium text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="人物简介" description={person.biography} />
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading title="生平时间线" description="用于展示人物经历节点。" />
              <Timeline items={person.timeline} />
            </div>
            <div>
              <SectionHeading title="主要事迹" description="本阶段仅保留自然中文占位段落。" />
              <ul className="grid gap-3">
                {person.deeds.map((deed) => (
                  <li className="rounded-[8px] border border-line bg-white p-4 text-sm leading-7 text-muted" key={deed}>
                    {deed}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="历史影像" description="人物影像统一使用占位组件，后续可替换为本地资料。" />
          <GalleryGrid images={person.gallery} />
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="精神品质" description="关键词来自人物数据，不写死固定类型。" />
          <div className="flex flex-wrap gap-2">
            {person.keywords.map((keyword) => (
              <Tag key={keyword} tone="red">
                {keyword}
              </Tag>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="相关实践项目" description="人物可关联多个实践项目。" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="相关文章" description="相关纪实文章由 storyIds 动态查询。" />
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

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="资料来源" description="后续补充真实人物资料时一并补充来源说明。" />
          <SourceList sources={person.sources} />
          <div className="mt-8">
            <Link className="btn-secondary" href="/people">
              <ArrowLeft aria-hidden="true" size={18} />
              返回人物档案
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
