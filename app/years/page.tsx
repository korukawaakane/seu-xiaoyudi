import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { PageHero } from "@/src/components/ui/PageHero";
import { getAvailableYears, getProjects, getYearArchive } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "历年索引",
  description: "按年份索引已发布的实践专题、英烈档案、活动动态与产品。",
  alternates: { canonical: "/years" },
};

export default async function YearsPage() {
  const years = getAvailableYears(await getProjects());
  const archives = await Promise.all(years.map((year) => getYearArchive(year)));

  return (
    <>
      <PageHero
        eyebrow="历年索引"
        title="沿着年份查找实践资料"
        description="年份页是辅助索引，自动汇集当年的实践专题、英烈档案、活动动态和产品。"
        stat={{ value: String(years.length), label: "个可浏览年份" }}
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
                        专题 {archive.projects.length} · 档案 {archive.people.length} · 动态 {archive.stories.length} · 产品 {archive.achievements.length}
                      </p>
                    </div>
                    <Link className="action-link mt-8" href={`/years/${year}`}>
                      查看 {itemCount} 项年度资料
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="尚无可浏览的年份"
              description="实践专题发布后会依据年份自动生成索引入口。"
            />
          )}
        </Container>
      </section>
    </>
  );
}
