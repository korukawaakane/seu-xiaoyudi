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
        description="纪实文章按分类和所属项目筛选，所有文章共用统一详情模板。"
      />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <StoriesExplorer projects={projects} stories={stories} />
        </Container>
      </section>
    </>
  );
}
