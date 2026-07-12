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
        title="让每份实践成果可持续归档"
        description="成果条目按类型、所属项目、年份和关键词筛选；未提供真实文件时不会生成无效链接。"
        stat={{ value: String(achievements.length), label: "项已收录成果" }}
      />
      <section className="section-space bg-paper">
        <Container>
          <AchievementsExplorer achievements={achievements} projects={projects} />
        </Container>
      </section>
    </>
  );
}
