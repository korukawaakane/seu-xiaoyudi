"use client";

import { useState } from "react";
import type { Project, Story } from "@/src/types";
import { StoryCard } from "@/src/components/cards/StoryCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterBar, FilterField } from "@/src/components/ui/FilterBar";
import { uniqueValues } from "@/src/lib/utils";

type StoriesExplorerProps = {
  stories: Story[];
  projects: Project[];
};

export function StoriesExplorer({ stories, projects }: StoriesExplorerProps) {
  const [category, setCategory] = useState("全部分类");
  const [projectId, setProjectId] = useState("全部项目");
  const categories = uniqueValues(stories.map((story) => story.category));
  const projectTitle = (id: string) =>
    projects.find((project) => project.id === id)?.title ?? "实践项目占位";

  const featuredStory = stories.find((story) => story.featured) ?? stories[0];
  const filtered = stories.filter((story) => {
    const matchesCategory = category === "全部分类" || story.category === category;
    const matchesProject = projectId === "全部项目" || story.projectId === projectId;
    return matchesCategory && matchesProject;
  });

  return (
    <>
      {featuredStory ? (
        <div className="mb-8 rounded-[8px] border border-line bg-white p-5 shadow-soft">
          <p className="mb-2 text-sm font-semibold text-brand">最新文章突出展示</p>
          <StoryCard
            compact
            projectTitle={projectTitle(featuredStory.projectId)}
            story={featuredStory}
          />
        </div>
      ) : null}

      <FilterBar>
        <FilterField label="分类筛选">
          <select className="field-control" onChange={(event) => setCategory(event.target.value)} value={category}>
            <option>全部分类</option>
            {categories.map((item) => (
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
          {filtered.map((story) => (
            <StoryCard
              key={story.id}
              projectTitle={projectTitle(story.projectId)}
              story={story}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="没有符合条件的纪实文章"
          description="请调整分类或所属项目筛选条件。"
        />
      )}
    </>
  );
}
