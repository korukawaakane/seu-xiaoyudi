import type { Metadata } from "next";
import { ProjectsExplorer } from "@/src/components/filters/ProjectsExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { projects } from "@/src/data/projects";

export const metadata: Metadata = {
  title: "历届实践",
  description: "按年份、学期、主题和地点浏览历届社会实践项目。",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="历届实践"
        title="按年份与学期持续归档"
        description="所有实践项目共用统一数据结构和详情模板，后续新增学期时只需追加新的项目数据。"
      />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <ProjectsExplorer projects={projects} />
        </Container>
      </section>
    </>
  );
}
