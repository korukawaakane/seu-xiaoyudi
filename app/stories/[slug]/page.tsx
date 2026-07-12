import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, FolderArchive, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
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

export async function generateMetadata({ params }: StoryDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};

  return {
    title: story.title + "｜实践纪实",
    description: story.summary,
    alternates: { canonical: "/stories/" + story.slug },
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
      <section className="bg-white py-10 sm:py-16">
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
            <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl">{story.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{story.summary}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
              <div className="inline-flex items-center gap-2">
                <CalendarDays aria-hidden="true" size={16} />
                <dt className="sr-only">日期</dt>
                <dd>{formatDate(story.date)}</dd>
              </div>
              <div className="inline-flex items-center gap-2">
                <FolderArchive aria-hidden="true" size={16} />
                <dt className="sr-only">所属项目</dt>
                <dd>{getProjectTitle(story.projectId)}</dd>
              </div>
              <div className="inline-flex items-center gap-2">
                <UserRound aria-hidden="true" size={16} />
                <dt className="sr-only">作者或整理人员</dt>
                <dd>{story.author}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-8 sm:py-10">
        <Container>
          <ImagePlaceholder alt={story.title + "封面区域占位"} className="aspect-[16/7] min-h-0" label="文章封面区域" type="story" />
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="prose-panel">
            <h2 className="font-serif text-2xl font-semibold text-ink">纪实正文</h2>
            {story.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <blockquote className="quote-panel mt-8">{story.summary}</blockquote>
          </article>
          <aside className="order-first border-b border-line pb-6 lg:order-none lg:border-l lg:border-b-0 lg:pl-6 lg:pb-0">
            <h2 className="font-serif text-xl font-semibold text-ink">文章信息</h2>
            <dl className="mt-4 grid gap-4 text-sm text-muted">
              <div>
                <dt className="font-medium text-ink">分类</dt>
                <dd className="mt-1">{story.category}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">所属项目</dt>
                <dd className="mt-1">{getProjectTitle(story.projectId)}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">整理人员</dt>
                <dd className="mt-1">{story.author}</dd>
              </div>
            </dl>
          </aside>
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading title="图片组" description="当前使用本地占位影像，后续可追加多张经授权的实践图片。" />
          <GalleryGrid images={story.gallery} />
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading title="相关项目入口" description="文章与项目通过项目标识建立关联。" />
          {project ? (
            <div className="max-w-md"><ProjectCard project={project} /></div>
          ) : (
            <EmptyState title="关联项目待补充" description="该文章尚未匹配到有效项目资料。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading title="相关文章" description="按同项目或同分类展示相关纪实内容。" />
          {relatedStories.length ? (
            <div className="grid gap-1">
              {relatedStories.map((item) => <StoryCard compact key={item.id} projectTitle={getProjectTitle(item.projectId)} story={item} />)}
            </div>
          ) : (
            <EmptyState title="相关文章待补充" description="后续新增文章后，系统会按关联关系自动推荐。" />
          )}
          <Link className="btn-secondary mt-8" href="/stories">
            <ArrowLeft aria-hidden="true" size={18} />
            返回文章列表
          </Link>
        </Container>
      </section>
    </>
  );
}
