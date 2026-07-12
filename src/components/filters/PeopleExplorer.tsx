"use client";

import { useState } from "react";
import type { Person, Project } from "@/src/types";
import { PersonCard } from "@/src/components/cards/PersonCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterBar, FilterField } from "@/src/components/ui/FilterBar";
import { uniqueValues } from "@/src/lib/utils";

type PeopleExplorerProps = {
  people: Person[];
  projects: Project[];
};

export function PeopleExplorer({ people, projects }: PeopleExplorerProps) {
  const [keyword, setKeyword] = useState("");
  const [year, setYear] = useState("全部年份");
  const [projectId, setProjectId] = useState("全部项目");
  const [spirit, setSpirit] = useState("全部关键词");

  const years = uniqueValues(projects.map((project) => `${project.year}年`));
  const spiritOptions = uniqueValues(people.flatMap((person) => person.keywords));
  const projectTitle = (id: string) =>
    projects.find((project) => project.id === id)?.title ?? "实践项目占位";

  const filtered = people.filter((person) => {
    const matchesKeyword =
      !keyword.trim() ||
      person.name.includes(keyword.trim()) ||
      person.summary.includes(keyword.trim());
    const matchesProject = projectId === "全部项目" || person.projectIds.includes(projectId);
    const matchesSpirit = spirit === "全部关键词" || person.keywords.includes(spirit);
    const matchesYear =
      year === "全部年份" ||
      person.projectIds.some((id) => {
        const project = projects.find((item) => item.id === id);
        return project ? `${project.year}年` === year : false;
      });

    return matchesKeyword && matchesProject && matchesSpirit && matchesYear;
  });

  return (
    <>
      <FilterBar>
        <FilterField label="姓名搜索">
          <input
            className="field-control"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="输入人物占位名称"
            type="search"
            value={keyword}
          />
        </FilterField>
        <FilterField label="年份筛选">
          <select className="field-control" onChange={(event) => setYear(event.target.value)} value={year}>
            <option>全部年份</option>
            {years.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="项目筛选">
          <select className="field-control" onChange={(event) => setProjectId(event.target.value)} value={projectId}>
            <option>全部项目</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="精神关键词">
          <select className="field-control" onChange={(event) => setSpirit(event.target.value)} value={spirit}>
            <option>全部关键词</option>
            {spiritOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              projectTitle={projectTitle(person.projectIds[0])}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="没有符合条件的人物档案"
          description="请调整搜索词、年份、项目或关键词筛选条件。"
        />
      )}
    </>
  );
}
