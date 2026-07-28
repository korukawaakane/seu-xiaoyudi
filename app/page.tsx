import type { Metadata } from "next";
import Link from "next/link";
import { Archive, CalendarDays, Layers3 } from "lucide-react";
import { AchievementCard } from "@/src/components/cards/AchievementCard";
import { PersonCard } from "@/src/components/cards/PersonCard";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
import { HomeDirectory } from "@/src/components/sections/HomeDirectory";
import { HomeHero } from "@/src/components/sections/HomeHero";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { StatCard } from "@/src/components/ui/StatCard";
import { platformPrinciples, siteConfig } from "@/src/config/site";
import {
  getAchievementsByProject,
  getAchievements,
  getArchiveStats,
  getFeaturedPeople,
  getFeaturedProject,
  getHomeContent,
  getLatestStories,
  getProjects,
} from "@/src/lib/content";

export const metadata: Metadata = {
  title: "首页",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    url: "/",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: siteConfig.siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: ["/images/og-image.svg"],
  },
};

export default async function Home() {
  const homeContent = getHomeContent();
  const [featuredProject, latestStories, allProjects, fallbackAchievements, archiveStats] = await Promise.all([
    getFeaturedProject(),
    getLatestStories(4),
    getProjects(),
    getAchievements(),
    getArchiveStats(),
  ]);
  const [featuredPeople, projectAchievements] = featuredProject
    ? await Promise.all([
        getFeaturedPeople(featuredProject.id),
        getAchievementsByProject(featuredProject.id),
      ])
    : [[], fallbackAchievements.slice(0, 3)];
  const recentProjects = allProjects.slice(0, 3);
  const projectTitles = new Map(allProjects.map((project) => [project.id, project.title]));

  return (
    <>
      <HomeHero project={featuredProject} />
      <HomeDirectory />

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading
            action={{ label: "查看全部动态", href: "/stories" }}
            eyebrow="活动动态"
            title="最近发生的实践"
            description={homeContent.storiesDescription}
          />
          {latestStories.length ? (
            <div className="grid gap-1">
              {latestStories.map((story) => (
                <StoryCard compact key={story.id} projectTitle={projectTitles.get(story.projectId) ?? "未关联专题"} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState title="活动动态待补充" description="新增并发布动态后，最新内容会自动在首页展示。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading
            action={{ label: "查看全部档案", href: "/people" }}
            eyebrow="英烈档案"
            title="一人一档，留存精神坐标"
            description={homeContent.peopleDescription}
          />
          {featuredPeople.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featuredPeople.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  projectTitle={featuredProject?.title}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="英烈档案待补充" description="英烈档案发布并与实践专题关联后，会自动展示在这里。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-ink text-white">
        <Container>
          <SectionHeading
            action={{ label: "查看全部产品", href: "/achievements" }}
            eyebrow="产品展示"
            title="从实践走向可用成果"
            description={homeContent.achievementsDescription}
            tone="dark"
          />
          {projectAchievements.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projectAchievements.map((achievement) => (
                <AchievementCard
                  achievement={achievement}
                  key={achievement.id}
                  projectTitle={projectTitles.get(achievement.projectId) ?? "未关联专题"}
                />
              ))}
            </div>
          ) : (
            <p className="border-y border-white/15 py-8 text-sm text-white/70">
              产品资料待补充，发布后的课程、折页、视频和报告会展示在这里。
            </p>
          )}
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading
            eyebrow="实践专题"
            title="把一次完整实践集中在一起"
            description={homeContent.projectsDescription}
          />
          {recentProjects.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recentProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          ) : (
            <EmptyState title="实践专题待补充" description="新增项目数据后，该区域会按日期自动更新。" />
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-secondary" href="/projects">
              <Archive aria-hidden="true" size={18} />
              浏览全部专题
            </Link>
            <Link className="btn-secondary" href="/years">
              <CalendarDays aria-hidden="true" size={18} />
              按年份查看
            </Link>
          </div>
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading eyebrow="实践影像" title="现场记录" description={homeContent.galleryDescription} />
          <GalleryGrid images={featuredProject?.gallery ?? []} />
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading
            eyebrow="平台简介"
            title={siteConfig.subtitle}
            description={homeContent.archiveIntro}
          />
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="paper-texture border-l-4 border-brand p-6">
              <p className="font-serif text-3xl font-semibold text-brand">点滴汇聚</p>
              <p className="mt-4 text-sm leading-7 text-muted">{homeContent.archiveNote}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {platformPrinciples.map((principle) => (
                <article className="border-t-2 border-brand/20 bg-white p-5" key={principle.id}>
                  <p className="font-serif text-xl font-semibold text-ink">{principle.title}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {siteConfig.showStats ? (
        <section className="section-space bg-white">
          <Container>
            <SectionHeading
              eyebrow="平台统计"
              title="公开内容概览"
              description="统计数据由当前实践专题、英烈档案、活动动态和产品条目自动计算。"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {archiveStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted">
              <Layers3 aria-hidden="true" size={17} />
              所有数量会随后台公开内容自动更新。
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
