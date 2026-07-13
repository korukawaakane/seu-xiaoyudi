import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Archive, Layers3 } from "lucide-react";
import { AchievementCard } from "@/src/components/cards/AchievementCard";
import { PersonCard } from "@/src/components/cards/PersonCard";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";
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
  getProjectTitle,
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

export default function Home() {
  const homeContent = getHomeContent();
  const featuredProject = getFeaturedProject();
  const featuredPeople = featuredProject ? getFeaturedPeople(featuredProject.id) : [];
  const latestStories = getLatestStories(4);
  const projectAchievements = featuredProject
    ? getAchievementsByProject(featuredProject.id)
    : getAchievements().slice(0, 3);
  const recentProjects = getProjects().slice(0, 3);
  const archiveStats = getArchiveStats();

  return (
    <>
      <HomeHero project={featuredProject} />

      <section className="section-space bg-white">
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
                <article className="border-t-2 border-brand/20 bg-paper p-5" key={principle.id}>
                  <p className="font-serif text-xl font-semibold text-ink">{principle.title}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading
            action={{ label: "查看全部人物", href: "/people" }}
            eyebrow="当前项目人物"
            title="关联人物档案"
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
            <EmptyState title="当前项目人物待补充" description="待项目与人物数据建立关联后，该区域会自动展示对应档案。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading
            action={{ label: "查看全部实践纪实", href: "/stories" }}
            eyebrow="最新实践动态"
            title="实践纪实"
            description={homeContent.storiesDescription}
          />
          {latestStories.length ? (
            <div className="grid gap-1">
              {latestStories.map((story) => (
                <StoryCard compact key={story.id} projectTitle={getProjectTitle(story.projectId)} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState title="实践纪实待补充" description="新增纪实文章后，最新内容会自动在首页展示。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading eyebrow="精选影像" title="影像记录" description={homeContent.galleryDescription} />
          <GalleryGrid images={featuredProject?.gallery ?? []} />
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading
            action={{ label: "查看全部历届实践", href: "/projects" }}
            eyebrow="历届实践入口"
            title="近期实践项目"
            description={homeContent.projectsDescription}
          />
          {recentProjects.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recentProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          ) : (
            <EmptyState title="实践项目待补充" description="新增项目数据后，该区域会按日期自动更新。" />
          )}
          <Link className="btn-secondary mt-8" href="/projects">
            <Archive aria-hidden="true" size={18} />
            浏览历届项目
          </Link>
        </Container>
      </section>

      <section className="section-space bg-ink text-white">
        <Container>
          <SectionHeading
            action={{ label: "进入成果中心", href: "/achievements" }}
            eyebrow="成果展示"
            title="当前项目成果"
            description={homeContent.achievementsDescription}
            tone="dark"
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projectAchievements.map((achievement) => (
              <AchievementCard
                achievement={achievement}
                key={achievement.id}
                projectTitle={getProjectTitle(achievement.projectId)}
              />
            ))}
          </div>
          <Link className="btn-secondary mt-8" href="/achievements">
            查看成果中心
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </Container>
      </section>

      {siteConfig.showStats ? (
        <section className="section-space bg-white">
          <Container>
            <SectionHeading
              eyebrow="平台统计"
              title="归档数据概览"
              description="统计数据直接由当前项目、人物、纪实、影像和成果条目计算。"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {archiveStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted">
              <Layers3 aria-hidden="true" size={17} />
              所有数量会随数据文件变化自动更新。
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
