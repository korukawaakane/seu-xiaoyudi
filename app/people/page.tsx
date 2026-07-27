import type { Metadata } from "next";
import { Suspense } from "react";
import { PeopleExplorer } from "@/src/components/filters/PeopleExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getPeople, getProjects } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "人物档案",
  description: "集中展示历届社会实践中收录的人物档案占位数据。",
  alternates: { canonical: "/people" },
  openGraph: {
    title: "人物档案｜SEU“小雨滴”社会实践团",
    description: "集中展示历届社会实践中收录的人物档案。",
    url: "/people",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "人物档案" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "人物档案｜SEU“小雨滴”社会实践团",
    description: "集中展示历届社会实践中收录的人物档案。",
    images: ["/images/og-image.svg"],
  },
};

export default async function PeoplePage() {
  const [people, projects] = await Promise.all([getPeople(), getProjects()]);

  return (
    <>
      <PageHero
        eyebrow="人物档案"
        title="连接实践与人物记忆"
        description="人物字段保持通用，可收录访谈对象、榜样人物、历史人物和实践相关人物，不预设单一类型。"
        stat={{ value: String(people.length), label: "份已收录档案" }}
      />
      <section className="section-space bg-paper">
        <Container>
          <Suspense fallback={<div aria-hidden="true" className="min-h-96" />}>
            <PeopleExplorer people={people} projects={projects} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
