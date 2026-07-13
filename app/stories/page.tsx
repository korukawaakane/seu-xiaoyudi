import type { Metadata } from "next";
import { StoriesExplorer } from "@/src/components/filters/StoriesExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getProjects, getStories } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "实践纪实",
  description: "以文章列表形式展示社会实践过程记录。",
  alternates: { canonical: "/stories" },
  openGraph: {
    title: "实践纪实｜SEU“小雨滴”社会实践团",
    description: "以文章列表形式展示社会实践过程记录。",
    url: "/stories",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "实践纪实" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "实践纪实｜SEU“小雨滴”社会实践团",
    description: "以文章列表形式展示社会实践过程记录。",
    images: ["/images/og-image.svg"],
  },
};

export default function StoriesPage() {
  const projects = getProjects();
  const stories = getStories();

  return (
    <>
      <PageHero
        eyebrow="实践纪实"
        title="记录实践过程与现场材料"
        description="纪实文章按分类、所属项目和年份筛选，全部文章共用统一的阅读详情页面。"
        stat={{ value: String(stories.length), label: "篇已收录文章" }}
      />
      <section className="section-space bg-paper">
        <Container>
          <StoriesExplorer projects={projects} stories={stories} />
        </Container>
      </section>
    </>
  );
}
