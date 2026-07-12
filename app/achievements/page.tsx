import type { Metadata } from "next";
import { AchievementsExplorer } from "@/src/components/filters/AchievementsExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { achievements } from "@/src/data/achievements";
import { projects } from "@/src/data/projects";

export const metadata: Metadata = {
  title: "成果中心",
  description: "展示调研报告、展示文稿、视频作品、宣传海报等实践成果占位条目。",
};

export default function AchievementsPage() {
  return (
    <>
      <PageHero
        eyebrow="成果中心"
        title="统一管理实践成果"
        description="成果条目按类型和所属项目筛选，本阶段不提供真实文件下载，避免无效链接。"
      />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <AchievementsExplorer achievements={achievements} projects={projects} />
        </Container>
      </section>
    </>
  );
}
