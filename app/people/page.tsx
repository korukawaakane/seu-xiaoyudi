import type { Metadata } from "next";
import { Suspense } from "react";
import { PeopleExplorer } from "@/src/components/filters/PeopleExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getPeople, getProjects } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "英烈档案",
  description: "一人一档整理英烈生平、事迹、精神关键词与相关实践资料。",
  alternates: { canonical: "/people" },
  openGraph: {
    title: "英烈档案｜SEU“小雨滴”社会实践团",
    description: "一人一档整理英烈生平、事迹、精神关键词与相关实践资料。",
    url: "/people",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "英烈档案" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "英烈档案｜SEU“小雨滴”社会实践团",
    description: "一人一档整理英烈生平、事迹、精神关键词与相关实践资料。",
    images: ["/images/og-image.svg"],
  },
};

export default async function PeoplePage() {
  const [people, projects] = await Promise.all([getPeople(), getProjects()]);

  return (
    <>
      <PageHero
        eyebrow="英烈档案"
        title="一位英烈，一份完整档案"
        description="每份档案独立整理生平、身份、重要事迹、精神关键词、影像与相关实践专题。"
        stat={{ value: String(people.length), label: "份已公开档案" }}
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
