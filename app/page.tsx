import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AchievementCard } from "@/src/components/cards/AchievementCard";
import { PersonCard } from "@/src/components/cards/PersonCard";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { HomeHero } from "@/src/components/sections/HomeHero";
import { Container } from "@/src/components/ui/Container";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { StatCard } from "@/src/components/ui/StatCard";
import { siteConfig, siteStats } from "@/src/config/site";
import { achievements } from "@/src/data/achievements";
import { projects } from "@/src/data/projects";
import {
  getAchievementsByProject,
  getFeaturedPeople,
  getFeaturedProject,
  getLatestStories,
  getProjectTitle,
} from "@/src/lib/data";

export const metadata: Metadata = {
  title: "首页",
  description: siteConfig.description,
};

export default function Home() {
  const featuredProject = getFeaturedProject();
  const featuredPeople = getFeaturedPeople(featuredProject.id);
  const latestStories = getLatestStories(4);
  const projectAchievements = getAchievementsByProject(featuredProject.id);

  return (
    <>
      <HomeHero project={featuredProject} />

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <SectionHeading
            eyebrow="平台简介"
            title={siteConfig.subtitle}
            description={`本平台用于记录${siteConfig.teamName}历届社会实践项目，整理实践过程、人物档案、影像资料与成果内容，让每一次实践都有迹可循。`}
          />
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[8px] border border-line bg-paper p-6">
              <p className="font-serif text-3xl font-semibold text-brand">点滴汇聚</p>
              <p className="mt-4 text-sm leading-7 text-muted">
                以年份、学期和项目为稳定层级，将人物、纪实、影像和成果统一归档，后续新增资料只需要补充数据。
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="项目层级" note="按年份与学期组织" value="年份" />
              <StatCard label="详情模板" note="项目、人物和文章共用模板" value="统一" />
              <StatCard label="内容状态" note="后续替换真实资料" value="占位" />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-18">
        <Container>
          <SectionHeading
            action={{ label: "查看全部人物", href: "/people" }}
            eyebrow="当前项目人物"
            title="关联人物档案"
            description="人物数量由项目数据动态决定，后续可按实践项目持续新增。"
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featuredPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                projectTitle={featuredProject.title}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <SectionHeading
            action={{ label: "进入实践纪实", href: "/stories" }}
            eyebrow="最新实践动态"
            title="纪实文章"
            description="以新闻列表和文章卡片形式展示实践过程，完整内容进入实践纪实栏目。"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {latestStories.map((story) => (
              <StoryCard
                compact
                key={story.id}
                projectTitle={getProjectTitle(story.projectId)}
                story={story}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-18">
        <Container>
          <SectionHeading
            eyebrow="精选影像"
            title="影像资料占位"
            description="当前使用统一占位组件展示实地走访、团队活动、场馆参观、采访调研、学习讨论与成果汇报等影像类别。"
          />
          <GalleryGrid images={featuredProject.gallery} />
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <SectionHeading
            action={{ label: "查看全部历届实践", href: "/projects" }}
            eyebrow="历届实践入口"
            title="近期实践项目"
            description="所有实践项目共用同一套项目详情模板，按照年份和学期持续归档。"
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-18">
        <Container>
          <SectionHeading
            action={{ label: "进入成果中心", href: "/achievements" }}
            eyebrow="成果展示"
            title="当前项目成果"
            description="成果条目使用占位状态，不链接真实文件，后续可在数据文件中补充预览和下载地址。"
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(projectAchievements.length ? projectAchievements : achievements.slice(0, 3)).map(
              (achievement) => (
                <AchievementCard
                  achievement={achievement}
                  key={achievement.id}
                  projectTitle={getProjectTitle(achievement.projectId)}
                />
              ),
            )}
          </div>
          <div className="mt-8">
            <Link className="btn-secondary" href="/achievements">
              查看成果中心
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </Container>
      </section>

      {siteConfig.showStats ? (
        <section className="bg-white py-14 sm:py-18">
          <Container>
            <SectionHeading
              eyebrow="平台统计"
              title="归档数据概览"
              description="当前为占位统计，后续应由项目、人物、纪实、影像和成果数据自动计算。"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {siteStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
