"use client";

import { useState } from "react";
import type { Project } from "@/src/types";
import { ProjectCard } from "@/src/components/cards/ProjectCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterBar, FilterField } from "@/src/components/ui/FilterBar";
import { uniqueValues } from "@/src/lib/utils";

type ProjectsExplorerProps = {
  projects: Project[];
};

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [year, setYear] = useState("全部年份");
  const [semester, setSemester] = useState("全部学期");
  const [theme, setTheme] = useState("全部主题");
  const [location, setLocation] = useState("全部地点");

  const years = uniqueValues(projects.map((project) => `${project.year}年`));
  const semesters = uniqueValues(projects.map((project) => project.semester));
  const themes = uniqueValues(projects.map((project) => project.theme));
  const locations = uniqueValues(projects.map((project) => project.location));

  const filtered = projects.filter((project) => {
    const matchesYear = year === "全部年份" || `${project.year}年` === year;
    const matchesSemester = semester === "全部学期" || project.semester === semester;
    const matchesTheme = theme === "全部主题" || project.theme === theme;
    const matchesLocation = location === "全部地点" || project.location === location;
    return matchesYear && matchesSemester && matchesTheme && matchesLocation;
  });

  return (
    <>
      <FilterBar>
        <FilterField label="年份筛选">
          <select className="field-control" onChange={(event) => setYear(event.target.value)} value={year}>
            <option>全部年份</option>
            {years.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="学期筛选">
          <select className="field-control" onChange={(event) => setSemester(event.target.value)} value={semester}>
            <option>全部学期</option>
            {semesters.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="主题筛选">
          <select className="field-control" onChange={(event) => setTheme(event.target.value)} value={theme}>
            <option>全部主题</option>
            {themes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="地点筛选">
          <select className="field-control" onChange={(event) => setLocation(event.target.value)} value={location}>
            <option>全部地点</option>
            {locations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="没有符合条件的实践项目"
          description="请调整年份、学期、主题或地点筛选条件。后续新增项目时也会自动进入此列表。"
        />
      )}
    </>
  );
}
