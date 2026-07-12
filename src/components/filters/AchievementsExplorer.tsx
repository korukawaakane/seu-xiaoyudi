"use client";

import type { Achievement, Project } from "@/src/types";
import { AchievementCard } from "@/src/components/cards/AchievementCard";
import { useQueryFilters } from "@/src/components/filters/useQueryFilters";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterBar, FilterField } from "@/src/components/ui/FilterBar";
import { filterAchievements, getAchievementTypes, getAvailableYears } from "@/src/lib/data";

type AchievementsExplorerProps = {
  achievements: Achievement[];
  projects: Project[];
};

export function AchievementsExplorer({ achievements, projects }: AchievementsExplorerProps) {
  const { reset, update, value } = useQueryFilters();
  const filters = {
    type: value("type"),
    project: value("project"),
    year: value("year"),
    keyword: value("keyword"),
  };
  const types = getAchievementTypes(achievements);
  const years = getAvailableYears(projects);
  const filtered = filterAchievements(achievements, projects, filters);
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const projectTitle = (id: string) =>
    projects.find((project) => project.id === id)?.title ?? "实践项目占位";

  return (
    <>
      <FilterBar>
        <FilterField label="关键词搜索">
          <input aria-label="关键词搜索" className="field-control" onChange={(event) => update("keyword", event.currentTarget.value)} onInput={(event) => update("keyword", event.currentTarget.value)} placeholder="成果名称或简介关键词" type="search" value={filters.keyword} />
        </FilterField>
        <FilterField label="成果类型">
          <select aria-label="成果类型" className="field-control" onChange={(event) => update("type", event.currentTarget.value)} onInput={(event) => update("type", event.currentTarget.value)} value={filters.type}>
            <option value="">全部类型</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
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
        <p aria-live="polite" className="text-sm text-muted">当前显示 {filtered.length} 项实践成果</p>
        <button className="btn-secondary min-h-10 px-4 py-2" disabled={!hasActiveFilters} onClick={() => reset(["keyword", "type", "project", "year"])} type="button">
          重置筛选
        </button>
      </div>
      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((achievement) => (
            <AchievementCard achievement={achievement} key={achievement.id} projectTitle={projectTitle(achievement.projectId)} />
          ))}
        </div>
      ) : (
        <EmptyState title="没有符合条件的实践成果" description="请调整关键词、成果类型、所属项目或年份筛选条件。" />
      )}
    </>
  );
}
