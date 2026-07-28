import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchExplorer } from "@/src/components/filters/SearchExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getSearchIndex } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索已发布的实践专题、英烈档案、活动动态和产品。",
  alternates: { canonical: "/search" },
};

export default async function SearchPage() {
  const searchIndex = await getSearchIndex();

  return (
    <>
      <PageHero
        eyebrow="站内搜索"
        title="在全部公开资料中查找内容"
        description="可搜索实践专题、英烈档案、活动动态和产品的标题、简介、标签与关键词。"
      />
      <section className="section-space bg-paper">
        <Container>
          <Suspense fallback={<div aria-hidden="true" className="min-h-96" />}>
            <SearchExplorer items={searchIndex} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
