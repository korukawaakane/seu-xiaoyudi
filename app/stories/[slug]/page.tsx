import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, FolderArchive, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { StoryMarkdown } from "@/src/components/sections/StoryMarkdown";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { Tag } from "@/src/components/ui/Tag";
import {
  getProjects,
  getRelatedStories,
  getStories,
  getStoryBySlug,
} from "@/src/lib/content";
import { formatDate } from "@/src/lib/utils";

type StoryDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getStories()).map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: StoryDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return {};
  const title = `${story.title}｜活动动态｜SEU“小雨滴”社会实践团`;

  return {
    title: { absolute: title },
    description: story.summary,
    alternates: { canonical: "/stories/" + story.slug },
    openGraph: {
      title,
      description: story.summary,
      url: "/stories/" + story.slug,
      type: "article",
      publishedTime: story.date,
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
      description: story.summary,
      images: ["/images/og-image.svg"],
    },
  };
}

export default async function StoryDetailPage({ params }: StoryDetailProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const [projects, relatedStories] = await Promise.all([getProjects(), getRelatedStories(story)]);
  const project = projects.find((item) => item.id === story.projectId);
  const projectTitles = new Map(projects.map((item) => [item.id, item.title]));

  return (
    <>
      <section className="bg-white py-10 sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "活动动态", href: "/stories" },
              { label: story.title },
            ]}
          />
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <Tag tone="red" value={story.category}>{story.category}</Tag>
              {story.tags.map((tag) => <Tag key={tag} tone="bronze" value={tag}>{tag}</Tag>)}
            </div>
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
                <dt className="sr-only">实践专题</dt>
                <dd>{projectTitles.get(story.projectId) ?? "未关联专题"}</dd>
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
          <ImagePlaceholder alt={story.title + "封面区域占位"} className="aspect-[16/7] min-h-0" label="文章封面区域" src={story.coverImage} type="story" />
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="prose-panel">
            <h2 className="font-serif text-2xl font-semibold text-ink">动态正文</h2>
            <StoryMarkdown blocks={story.content} />
            <blockquote className="quote-panel mt-8">{story.summary}</blockquote>
          </article>
          <aside className="order-first border-b border-line pb-6 lg:order-none lg:border-l lg:border-b-0 lg:pl-6 lg:pb-0">
            <h2 className="font-serif text-xl font-semibold text-ink">动态信息</h2>
            <dl className="mt-4 grid gap-4 text-sm text-muted">
              <div>
                <dt className="font-medium text-ink">分类</dt>
                <dd className="mt-1">{story.category}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">实践专题</dt>
                <dd className="mt-1">{projectTitles.get(story.projectId) ?? "未关联专题"}</dd>
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
          <SectionHeading title="相关实践专题" description="动态与专题通过项目标识建立关联。" />
          {project ? (
            <div className="max-w-md"><ProjectCard project={project} /></div>
          ) : (
            <EmptyState title="关联专题待补充" description="该动态尚未匹配到有效专题资料。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading title="相关动态" description="按同专题或同分类展示相关活动内容。" />
          {relatedStories.length ? (
            <div className="grid gap-1">
              {relatedStories.map((item) => <StoryCard compact key={item.id} projectTitle={projectTitles.get(item.projectId) ?? "未关联专题"} story={item} />)}
            </div>
          ) : (
            <EmptyState title="相关动态待补充" description="后续新增动态后，系统会按关联关系自动推荐。" />
          )}
          <Link className="btn-secondary mt-8" href="/stories">
            <ArrowLeft aria-hidden="true" size={18} />
            返回活动动态
          </Link>
        </Container>
      </section>
    </>
  );
}
