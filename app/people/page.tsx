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
        title="连接实践与人物记忆"
        description="人物字段保持通用，可收录访谈对象、榜样人物、历史人物和实践相关人物，不预设单一类型。"
        stat={{ value: String(people.length), label: "份已收录档案" }}
      />
      <section className="section-space bg-paper">
        <Container>
          <PeopleExplorer people={people} projects={projects} />
        </Container>
      </section>
    </>
  );
}
