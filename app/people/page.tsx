import type { Metadata } from "next";
import { PeopleExplorer } from "@/src/components/filters/PeopleExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { people } from "@/src/data/people";
import { projects } from "@/src/data/projects";

export const metadata: Metadata = {
  title: "人物档案",
  description: "集中展示历届社会实践中收录的人物档案占位数据。",
};

export default function PeoplePage() {
  return (
    <>
      <PageHero
        eyebrow="人物档案"
        title="通用人物档案模板"
        description="人物字段保持通用，可收录访谈对象、榜样人物、历史人物和实践相关人物，不假设单一人物类型。"
      />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <PeopleExplorer people={people} projects={projects} />
        </Container>
      </section>
    </>
  );
}
