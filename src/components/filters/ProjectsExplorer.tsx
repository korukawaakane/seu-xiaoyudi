"use client";

import type { Project } from "@/src/types";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { useQueryFilters } from "@/src/components/filters/useQueryFilters";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterBar, FilterField } from "@/src/components/ui/FilterBar";
import {
  filterProjects,
  getAvailableLocations,
  getAvailableSemesters,
  getAvailableYears,
  getProjectGroupsByYear,
} from "@/src/lib/content";
import { uniqueValues } from "@/src/lib/utils";

type ProjectsExplorerProps = {
  projects: Project[];
};

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const { reset, update, value } = useQueryFilters();
  const filters = {
    year: value("year"),
    semester: value("semester"),
    theme: value("theme"),
    location: value("location"),
  };
  const years = getAvailableYears(projects);
  const semesters = getAvailableSemesters(projects);
  const themes = uniqueValues(projects.map((project) => project.theme)).sort();
  const locations = getAvailableLocations(projects);
  const filtered = filterProjects(projects, filters);
  const groups = getProjectGroupsByYear(filtered);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <FilterBar>
        <FilterField label="年份筛选">
          <select aria-label="年份筛选" className="field-control" onChange={(event) => update("year", event.currentTarget.value)} onInput={(event) => update("year", event.currentTarget.value)} value={filters.year}>
            <option value="">全部年份</option>
            {years.map((year) => (
              <option key={year} value={String(year)}>{year}年</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="学期筛选">
          <select aria-label="学期筛选" className="field-control" onChange={(event) => update("semester", event.currentTarget.value)} onInput={(event) => update("semester", event.currentTarget.value)} value={filters.semester}>
            <option value="">全部学期</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="主题筛选">
          <select aria-label="主题筛选" className="field-control" onChange={(event) => update("theme", event.currentTarget.value)} onInput={(event) => update("theme", event.currentTarget.value)} value={filters.theme}>
            <option value="">全部主题</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="地点筛选">
          <select aria-label="地点筛选" className="field-control" onChange={(event) => update("location", event.currentTarget.value)} onInput={(event) => update("location", event.currentTarget.value)} value={filters.location}>
            <option value="">全部地点</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </FilterField>
      </FilterBar>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <p aria-live="polite" className="text-sm text-muted">当前显示 {filtered.length} 个项目</p>
        <button
          className="btn-secondary min-h-10 px-4 py-2"
          disabled={!hasActiveFilters}
          onClick={() => reset(["year", "semester", "theme", "location"])}
          type="button"
        >
          重置筛选
        </button>
      </div>

      {groups.length ? (
        <div className="grid gap-14">
          {groups.map((group) => (
            <section aria-labelledby={"projects-year-" + group.year} key={group.year}>
              <div className="mb-6 flex items-end gap-5 border-b border-line pb-4">
                <p aria-hidden="true" className="archive-year">{group.year}</p>
                <p className="pb-1 text-sm text-muted" id={"projects-year-" + group.year}>
                  该年度收录 {group.projects.length} 个实践专题
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {group.projects.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          title="没有符合条件的实践专题"
          description="请调整年份、学期、主题或地点筛选条件；新增项目时会自动进入此列表。"
        />
      )}
    </>
  );
}
