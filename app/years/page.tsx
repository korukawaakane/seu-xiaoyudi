import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { PageHero } from "@/src/components/ui/PageHero";
import { getAvailableYears, getProjects, getYearArchive } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "年份归档",
  description: "按年份浏览已发布的项目、人物、纪实文章与实践成果。",
  alternates: { canonical: "/years" },
};

export default async function YearsPage() {
  const years = getAvailableYears(await getProjects());
  const archives = await Promise.all(years.map((year) => getYearArchive(year)));

  return (
    <>
      <PageHero
        eyebrow="年份归档"
        title="从每一个年份回看实践积累。"
        description="每个年份页会自动汇集关联的公开项目、人物档案、纪实文章和实践成果。"
        stat={{ value: String(years.length), label: "个已归档年份" }}
      />
      <section className="section-space bg-paper">
        <Container>
          {years.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {years.map((year, index) => {
                const archive = archives[index];
                const itemCount =
                  archive.projects.length +
                  archive.people.length +
                  archive.stories.length +
                  archive.achievements.length;

                return (
                  <article className="card flex min-h-64 flex-col justify-between" key={year}>
                    <div>
                      <CalendarDays aria-hidden="true" className="text-brand" size={24} />
                      <p className="archive-year mt-8">{year}</p>
                      <p className="mt-4 text-sm leading-7 text-muted">
                        项目 {archive.projects.length} · 人物 {archive.people.length} · 文章 {archive.stories.length} · 成果 {archive.achievements.length}
                      </p>
                    </div>
                    <Link className="action-link mt-8" href={`/years/${year}`}>
                      查看 {itemCount} 项年度归档
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="尚无已发布的年份归档"
              description="项目发布后会依据年份自动生成归档入口。"
            />
          )}
        </Container>
      </section>
    </>
  );
}
