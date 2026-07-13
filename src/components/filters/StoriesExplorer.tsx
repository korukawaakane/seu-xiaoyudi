"use client";

import type { Project, Story } from "@/src/types";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { useQueryFilters } from "@/src/components/filters/useQueryFilters";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterBar, FilterField } from "@/src/components/ui/FilterBar";
import { filterStories, getAvailableYears, getFeaturedStory, getStoryCategories } from "@/src/lib/content";

type StoriesExplorerProps = {
  stories: Story[];
  projects: Project[];
};

export function StoriesExplorer({ stories, projects }: StoriesExplorerProps) {
  const { reset, update, value } = useQueryFilters();
  const filters = {
    category: value("category"),
    project: value("project"),
    year: value("year"),
    keyword: value("keyword"),
  };
  const categories = getStoryCategories(stories);
  const years = getAvailableYears(projects);
  const featuredStory = getFeaturedStory(stories);
  const filtered = filterStories(stories, projects, filters);
  const regularStories = filtered.filter((story) => story.id !== featuredStory?.id);
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const projectTitle = (id: string) =>
    projects.find((project) => project.id === id)?.title ?? "实践项目占位";

  return (
    <>
      {featuredStory ? (
        <section className="mb-10 border-y border-line bg-white py-6 sm:px-6" aria-labelledby="featured-story">
          <p className="text-sm font-semibold text-brand">重点文章</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink" id="featured-story">最新实践记录</h2>
          <div className="mt-5">
            <StoryCard compact projectTitle={projectTitle(featuredStory.projectId)} story={featuredStory} />
          </div>
        </section>
      ) : null}
      <FilterBar>
        <FilterField label="关键词搜索">
          <input aria-label="关键词搜索" className="field-control" onChange={(event) => update("keyword", event.currentTarget.value)} onInput={(event) => update("keyword", event.currentTarget.value)} placeholder="标题或摘要关键词" type="search" value={filters.keyword} />
        </FilterField>
        <FilterField label="分类筛选">
          <select aria-label="分类筛选" className="field-control" onChange={(event) => update("category", event.currentTarget.value)} onInput={(event) => update("category", event.currentTarget.value)} value={filters.category}>
            <option value="">全部分类</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </FilterField>
        <FilterField label="所属项目">
          <select aria-label="所属项目" className="field-control" onChange={(event) => update("project", event.currentTarget.value)} onInput={(event) => update("project", event.currentTarget.value)} value={filters.project}>
            <option value="">全部项目</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </select>
        </FilterField>
        <FilterField label="年份筛选">
          <select aria-label="年份筛选" className="field-control" onChange={(event) => update("year", event.currentTarget.value)} onInput={(event) => update("year", event.currentTarget.value)} value={filters.year}>
            <option value="">全部年份</option>
            {years.map((year) => <option key={year} value={String(year)}>{year}年</option>)}
          </select>
        </FilterField>
      </FilterBar>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <p aria-live="polite" className="text-sm text-muted">当前显示 {filtered.length} 篇纪实文章</p>
        <button className="btn-secondary min-h-10 px-4 py-2" disabled={!hasActiveFilters} onClick={() => reset(["keyword", "category", "project", "year"])} type="button">
          重置筛选
        </button>
      </div>
      {regularStories.length ? (
        <div className="grid gap-1">
          {regularStories.map((story) => <StoryCard compact key={story.id} projectTitle={projectTitle(story.projectId)} story={story} />)}
        </div>
      ) : filtered.length && featuredStory && filtered[0]?.id === featuredStory.id ? (
        <div className="rounded-[8px] border border-line bg-white p-5 text-sm text-muted">当前筛选结果已在重点文章区域展示。</div>
      ) : (
        <EmptyState title="没有符合条件的纪实文章" description="请调整关键词、分类、所属项目或年份筛选条件。" />
      )}
    </>
  );
}
