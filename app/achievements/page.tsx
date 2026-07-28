import type { Metadata } from "next";
import { Suspense } from "react";
import { AchievementsExplorer } from "@/src/components/filters/AchievementsExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getAchievements, getProjects } from "@/src/lib/content";

export const metadata: Metadata = {
  title: { absolute: "产品展示｜SEU“小雨滴”社会实践团" },
  description: "展示课程、折页、配套视频、调研报告等社会实践产品。",
  alternates: { canonical: "/achievements" },
  openGraph: {
    title: "产品展示｜SEU“小雨滴”社会实践团",
    description: "展示课程、折页、配套视频、调研报告等社会实践产品。",
    url: "/achievements",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "产品展示｜SEU“小雨滴”社会实践团",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "产品展示｜SEU“小雨滴”社会实践团",
    description: "展示课程、折页、配套视频、调研报告等社会实践产品。",
    images: ["/images/og-image.svg"],
  },
};

export default async function AchievementsPage() {
  const [achievements, projects] = await Promise.all([getAchievements(), getProjects()]);

  return (
    <>
      <PageHero
        eyebrow="产品展示"
        title="让实践成果成为可使用的产品"
        description="课程、折页、配套视频、调研报告等内容按类型、实践专题和年份统一展示。"
        stat={{ value: String(achievements.length), label: "项已公开产品" }}
      />
      <section className="section-space bg-paper">
        <Container>
          <Suspense fallback={<div aria-hidden="true" className="min-h-96" />}>
            <AchievementsExplorer achievements={achievements} projects={projects} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
