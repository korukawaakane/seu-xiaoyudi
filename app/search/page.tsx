import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchExplorer } from "@/src/components/filters/SearchExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getSearchIndex } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "全站搜索",
  description: "搜索已发布的项目、人物、纪实文章和实践成果。",
  alternates: { canonical: "/search" },
};

export default async function SearchPage() {
  const searchIndex = await getSearchIndex();

  return (
    <>
      <PageHero
        eyebrow="全站搜索"
        title="在实践档案中找到关联内容。"
        description="可搜索项目、人物、纪实文章和实践成果的标题、简介、标签与关键词。"
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
