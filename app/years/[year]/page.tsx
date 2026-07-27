import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AchievementCard } from "@/src/components/cards/AchievementCard";
import { PersonCard } from "@/src/components/cards/PersonCard";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { PageHero } from "@/src/components/ui/PageHero";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { getAvailableYears, getProjects, getYearArchive } from "@/src/lib/content";

type YearArchivePageProps = {
  params: Promise<{ year: string }>;
};

const isAvailableYear = async (year: number) => getAvailableYears(await getProjects()).includes(year);

export async function generateStaticParams() {
  return (await getAvailableYears(await getProjects())).map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: YearArchivePageProps): Promise<Metadata> {
  const { year: yearParam } = await params;
  const year = Number(yearParam);

  if (!Number.isInteger(year) || !(await isAvailableYear(year))) return {};

  return {
    title: `${year} 年归档`,
    description: `${year} 年已发布的项目、人物、纪实文章和实践成果。`,
    alternates: { canonical: `/years/${year}` },
  };
}

export default async function YearArchivePage({ params }: YearArchivePageProps) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);

  if (!Number.isInteger(year) || !(await isAvailableYear(year))) notFound();

  const archive = await getYearArchive(year);
  const projectTitles = new Map(archive.projects.map((project) => [project.id, project.title]));
  const itemCount =
    archive.projects.length +
    archive.people.length +
    archive.stories.length +
    archive.achievements.length;

  return (
    <>
      <PageHero
        eyebrow="年份归档"
        title={`${year} 年实践档案`}
        description="以下内容根据项目关联自动归集，仅展示已发布的公开资料。"
        stat={{ value: String(itemCount), label: "项年度归档内容" }}
      />

      <section className="section-space bg-white">
        <Container>
          <SectionHeading title="实践项目" description="本年度已发布的实践项目。" />
          {archive.projects.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {archive.projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          ) : (
            <EmptyState title="本年度暂无公开项目" description="发布项目后会自动显示在此处。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading title="人物档案" description="关联至本年度项目的人物记录。" />
          {archive.people.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {archive.people.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  projectTitle={projectTitles.get(person.projectIds[0]) ?? "未关联项目"}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="本年度暂无公开人物档案" description="人物关联项目并发布后会自动显示在此处。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading title="纪实文章" description="记录本年度实践过程的公开文章。" />
          {archive.stories.length ? (
            <div className="grid gap-1">
              {archive.stories.map((story) => (
                <StoryCard
                  compact
                  key={story.id}
                  projectTitle={projectTitles.get(story.projectId) ?? "未关联项目"}
                  story={story}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="本年度暂无公开纪实文章" description="文章关联项目并发布后会自动显示在此处。" />
          )}
        </Container>
      </section>

      <section className="section-space bg-ink text-white">
        <Container>
          <SectionHeading tone="dark" title="实践成果" description="归属于本年度项目的公开成果。" />
          {archive.achievements.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {archive.achievements.map((achievement) => (
                <AchievementCard
                  achievement={achievement}
                  key={achievement.id}
                  projectTitle={projectTitles.get(achievement.projectId) ?? "未关联项目"}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="本年度暂无公开实践成果" description="成果关联项目并发布后会自动显示在此处。" />
          )}
        </Container>
      </section>
    </>
  );
}
