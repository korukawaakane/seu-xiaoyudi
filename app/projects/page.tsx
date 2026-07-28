import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsExplorer } from "@/src/components/filters/ProjectsExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getProjects } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "实践专题",
  description: "按项目集中浏览相关人物、活动动态、影像与实践产品。",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "实践专题｜SEU“小雨滴”社会实践团",
    description: "按项目集中浏览相关人物、活动动态、影像与实践产品。",
    url: "/projects",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "实践专题" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "实践专题｜SEU“小雨滴”社会实践团",
    description: "按项目集中浏览相关人物、活动动态、影像与实践产品。",
    images: ["/images/og-image.svg"],
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="实践专题"
        title="一次实践，一个完整专题"
        description="每个专题集中呈现项目背景、过程、相关英烈、活动动态、影像与产品；年份仅作为辅助筛选。"
        stat={{ value: String(projects.length), label: "个已公开专题" }}
      />
      <section className="section-space bg-paper">
        <Container>
          <Suspense fallback={<div aria-hidden="true" className="min-h-96" />}>
            <ProjectsExplorer projects={projects} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
