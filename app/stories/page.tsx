import type { Metadata } from "next";
import { Suspense } from "react";
import { StoriesExplorer } from "@/src/components/filters/StoriesExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getProjects, getStories } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "活动动态",
  description: "持续发布社会实践调研进展、实践日志与活动报道。",
  alternates: { canonical: "/stories" },
  openGraph: {
    title: "活动动态｜SEU“小雨滴”社会实践团",
    description: "持续发布社会实践调研进展、实践日志与活动报道。",
    url: "/stories",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "活动动态" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "活动动态｜SEU“小雨滴”社会实践团",
    description: "持续发布社会实践调研进展、实践日志与活动报道。",
    images: ["/images/og-image.svg"],
  },
};

export default async function StoriesPage() {
  const [projects, stories] = await Promise.all([getProjects(), getStories()]);

  return (
    <>
      <PageHero
        eyebrow="活动动态"
        title="记录正在发生的实践"
        description="调研进展、实践日志和活动报道按发布时间排列，也可按分类、实践专题和年份筛选。"
        stat={{ value: String(stories.length), label: "篇已发布动态" }}
      />
      <section className="section-space bg-paper">
        <Container>
          <Suspense fallback={<div aria-hidden="true" className="min-h-96" />}>
            <StoriesExplorer projects={projects} stories={stories} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
