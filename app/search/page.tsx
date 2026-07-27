import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Container } from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { PageHero } from "@/src/components/ui/PageHero";
import { Tag } from "@/src/components/ui/Tag";
import { getSearchResults, type SearchResultType } from "@/src/lib/content";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; tag?: string }>;
};

const typeLabels: Record<SearchResultType, string> = {
  project: "项目",
  person: "人物",
  story: "文章",
  achievement: "成果",
};

export const metadata: Metadata = {
  title: "全站搜索",
  description: "搜索已发布的项目、人物、纪实文章和实践成果。",
  alternates: { canonical: "/search" },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", tag = "" } = await searchParams;
  const hasQuery = Boolean(q.trim() || tag.trim());
  const results = await getSearchResults({ query: q, tag });

  return (
    <>
      <PageHero
        eyebrow="全站搜索"
        title="在实践档案中找到关联内容。"
        description="可搜索项目、人物、纪实文章和实践成果的标题、简介、标签与关键词。"
      />
      <section className="section-space bg-paper">
        <Container>
          <form action="/search" className="grid gap-3 rounded-[8px] border border-line bg-white p-4 shadow-soft sm:grid-cols-[minmax(0,1fr)_auto]" role="search">
            {tag ? <input name="tag" type="hidden" value={tag} /> : null}
            <label className="sr-only" htmlFor="site-search">搜索站内内容</label>
            <input
              className="field-control"
              defaultValue={q}
              id="site-search"
              name="q"
              placeholder="输入标题、简介、标签或关键词"
              type="search"
            />
            <button className="btn-primary" type="submit">
              <Search aria-hidden="true" size={18} />
              搜索
            </button>
          </form>

          {tag ? (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>当前标签：</span>
              <Tag tone="bronze">{tag}</Tag>
              <Link className="action-link min-h-0 py-1" href={q ? `/search?q=${encodeURIComponent(q)}` : "/search"}>
                清除标签筛选
              </Link>
            </div>
          ) : null}

          {hasQuery ? (
            <div className="mt-9">
              <p aria-live="polite" className="border-b border-line pb-4 text-sm text-muted">
                找到 {results.length} 条公开内容
              </p>
              {results.length ? (
                <div className="mt-6 grid gap-4">
                  {results.map((result) => (
                    <article className="card" key={`${result.type}-${result.id}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag tone="red">{typeLabels[result.type]}</Tag>
                        <span className="text-xs text-muted">{result.meta}</span>
                      </div>
                      <h2 className="mt-4 font-serif text-2xl font-semibold text-ink">{result.title}</h2>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{result.summary}</p>
                      {result.tags.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {result.tags.map((item) => <Tag key={item} tone="bronze" value={item}>{item}</Tag>)}
                        </div>
                      ) : null}
                      <Link className="action-link mt-5" href={result.href}>
                        查看内容
                        <ArrowRight aria-hidden="true" size={16} />
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    title="没有匹配的公开内容"
                    description="请尝试更换关键词，或通过页面中的标签继续浏览。"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="输入关键词开始搜索"
                description="标签、人物关键词、文章分类和成果类型都可以直接检索。"
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
