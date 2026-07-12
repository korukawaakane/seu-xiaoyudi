"use client";

import { useState } from "react";
import type { Achievement, Project } from "@/src/types";
import { AchievementCard } from "@/src/components/cards/AchievementCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterBar, FilterField } from "@/src/components/ui/FilterBar";
import { uniqueValues } from "@/src/lib/utils";

type AchievementsExplorerProps = {
  achievements: Achievement[];
  projects: Project[];
};

export function AchievementsExplorer({
  achievements,
  projects,
}: AchievementsExplorerProps) {
  const [type, setType] = useState("全部类型");
  const [projectId, setProjectId] = useState("全部项目");
  const types = uniqueValues(achievements.map((achievement) => achievement.type));
  const projectTitle = (id: string) =>
    projects.find((project) => project.id === id)?.title ?? "实践项目占位";

  const filtered = achievements.filter((achievement) => {
    const matchesType = type === "全部类型" || achievement.type === type;
    const matchesProject = projectId === "全部项目" || achievement.projectId === projectId;
    return matchesType && matchesProject;
  });

  return (
    <>
      <FilterBar>
        <FilterField label="成果类型">
          <select className="field-control" onChange={(event) => setType(event.target.value)} value={type}>
            <option>全部类型</option>
            {types.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="所属项目">
          <select className="field-control" onChange={(event) => setProjectId(event.target.value)} value={projectId}>
            <option>全部项目</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((achievement) => (
            <AchievementCard
              achievement={achievement}
              key={achievement.id}
              projectTitle={projectTitle(achievement.projectId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="没有符合条件的实践成果"
          description="请调整成果类型或所属项目筛选条件。"
        />
      )}
    </>
  );
}
