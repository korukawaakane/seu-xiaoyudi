import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { Container } from "@/src/components/ui/Container";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { Tag } from "@/src/components/ui/Tag";
import { stories } from "@/src/data/stories";
import {
  getProjectById,
  getProjectTitle,
  getRelatedStories,
  getStoryBySlug,
} from "@/src/lib/data";
import { formatDate } from "@/src/lib/utils";

type StoryDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: StoryDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};

  return {
    title: story.title,
    description: story.summary,
    openGraph: {
      title: story.title,
      description: story.summary,
      type: "article",
      publishedTime: story.date,
    },
  };
}

export default async function StoryDetailPage({ params }: StoryDetailProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const project = getProjectById(story.projectId);
  const relatedStories = getRelatedStories(story);

  return (
    <>
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "实践纪实", href: "/stories" },
              { label: story.title },
            ]}
          />
          <div className="max-w-4xl">
            <Tag tone="red">{story.category}</Tag>
            <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              {story.title}
            </h1>
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <div>
                <dt className="sr-only">日期</dt>
                <dd>{formatDate(story.date)}</dd>
              </div>
              <div>
                <dt className="sr-only">所属项目</dt>
                <dd>{getProjectTitle(story.projectId)}</dd>
              </div>
              <div>
                <dt className="sr-only">作者或整理人员</dt>
                <dd>{story.author}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-10">
        <Container>
          <ImagePlaceholder
            alt={`${story.title}封面区域占位`}
            className="aspect-[16/7] min-h-0"
            label="文章封面区域"
            type="story"
          />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="prose-panel">
            {story.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <aside className="space-y-5">
            <div className="rounded-[8px] border border-line bg-paper p-5">
              <h2 className="font-serif text-xl font-semibold text-ink">文章信息</h2>
              <dl className="mt-4 grid gap-3 text-sm text-muted">
                <div>
                  <dt className="font-medium text-ink">分类</dt>
                  <dd>{story.category}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">所属项目</dt>
                  <dd>{getProjectTitle(story.projectId)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">整理人员</dt>
                  <dd>{story.author}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="图片组" description="当前使用占位影像，后续可追加多张本地图片。" />
          <GalleryGrid images={story.gallery} />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="相关项目入口" description="文章与项目通过 projectId 建立关联。" />
          {project ? (
            <div className="max-w-md">
              <ProjectCard project={project} />
            </div>
          ) : null}
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="相关文章" description="根据同项目或同分类展示相关纪实。" />
          <div className="grid gap-6 lg:grid-cols-2">
            {relatedStories.map((item) => (
              <StoryCard
                compact
                key={item.id}
                projectTitle={getProjectTitle(item.projectId)}
                story={item}
              />
            ))}
          </div>
          <div className="mt-8">
            <Link className="btn-secondary" href="/stories">
              <ArrowLeft aria-hidden="true" size={18} />
              返回文章列表
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
