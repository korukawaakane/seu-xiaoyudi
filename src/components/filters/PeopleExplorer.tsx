"use client";

import type { Person, Project } from "@/src/types";
import { PersonCard } from "@/src/components/cards/PersonCard";
import { useQueryFilters } from "@/src/components/filters/useQueryFilters";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterBar, FilterField } from "@/src/components/ui/FilterBar";
import { getAvailableYears, searchPeople } from "@/src/lib/data";
import { uniqueValues } from "@/src/lib/utils";

type PeopleExplorerProps = {
  people: Person[];
  projects: Project[];
};

export function PeopleExplorer({ people, projects }: PeopleExplorerProps) {
  const { reset, update, value } = useQueryFilters();
  const filters = {
    keyword: value("keyword"),
    year: value("year"),
    project: value("project"),
    category: value("category"),
    spirit: value("spirit"),
  };
  const years = getAvailableYears(projects);
  const categories = uniqueValues(people.map((person) => person.category)).sort();
  const spiritOptions = uniqueValues(people.flatMap((person) => person.keywords)).sort();
  const filtered = searchPeople(people, projects, filters);
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const projectTitle = (id: string) =>
    projects.find((project) => project.id === id)?.title ?? "实践项目占位";

  return (
    <>
      <FilterBar className="xl:grid-cols-5">
        <FilterField label="姓名或关键词">
          <input
            aria-label="姓名或关键词"
            className="field-control"
            onChange={(event) => update("keyword", event.currentTarget.value)}
            onInput={(event) => update("keyword", event.currentTarget.value)}
            placeholder="姓名、简介或精神关键词"
            type="search"
            value={filters.keyword}
          />
        </FilterField>
        <FilterField label="年份筛选">
          <select aria-label="年份筛选" className="field-control" onChange={(event) => update("year", event.currentTarget.value)} onInput={(event) => update("year", event.currentTarget.value)} value={filters.year}>
            <option value="">全部年份</option>
            {years.map((year) => <option key={year} value={String(year)}>{year}年</option>)}
          </select>
        </FilterField>
        <FilterField label="项目筛选">
          <select aria-label="项目筛选" className="field-control" onChange={(event) => update("project", event.currentTarget.value)} onInput={(event) => update("project", event.currentTarget.value)} value={filters.project}>
            <option value="">全部项目</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </select>
        </FilterField>
        <FilterField label="人物类别">
          <select aria-label="人物类别" className="field-control" onChange={(event) => update("category", event.currentTarget.value)} onInput={(event) => update("category", event.currentTarget.value)} value={filters.category}>
            <option value="">全部类别</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </FilterField>
        <FilterField label="精神关键词">
          <select aria-label="精神关键词" className="field-control" onChange={(event) => update("spirit", event.currentTarget.value)} onInput={(event) => update("spirit", event.currentTarget.value)} value={filters.spirit}>
            <option value="">全部关键词</option>
            {spiritOptions.map((spirit) => <option key={spirit} value={spirit}>{spirit}</option>)}
          </select>
        </FilterField>
      </FilterBar>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <p aria-live="polite" className="text-sm text-muted">当前显示 {filtered.length} 份人物档案</p>
        <button
          className="btn-secondary min-h-10 px-4 py-2"
          disabled={!hasActiveFilters}
          onClick={() => reset(["keyword", "year", "project", "category", "spirit"])}
          type="button"
        >
          重置筛选
        </button>
      </div>
      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((person) => (
            <PersonCard key={person.id} person={person} projectTitle={projectTitle(person.projectIds[0])} />
          ))}
        </div>
      ) : (
        <EmptyState title="没有符合条件的人物档案" description="请调整搜索词、年份、项目、类别或关键词筛选条件。" />
      )}
    </>
  );
}
