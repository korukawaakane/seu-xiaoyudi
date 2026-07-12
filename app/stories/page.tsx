import type { Metadata } from "next";
import { StoriesExplorer } from "@/src/components/filters/StoriesExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { projects } from "@/src/data/projects";
import { stories } from "@/src/data/stories";

export const metadata: Metadata = {
  title: "实践纪实",
  description: "以文章列表形式展示社会实践过程记录。",
};

export default function StoriesPage() {
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
