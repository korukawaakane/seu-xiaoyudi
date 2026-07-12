import { achievements } from "@/src/data/achievements";
import { people } from "@/src/data/people";
import { projects } from "@/src/data/projects";
import { stories } from "@/src/data/stories";
import type { Achievement, Person, Project, Story } from "@/src/types";

export function getFeaturedProject(): Project {
  return projects.find((project) => project.featured) ?? projects[0];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getPersonBySlug(slug: string): Person | undefined {
  return people.find((person) => person.slug === slug);
}

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getPeopleByProject(projectId: string): Person[] {
  return people.filter((person) => person.projectIds.includes(projectId));
}

export function getStoriesByProject(projectId: string): Story[] {
  return stories
    .filter((story) => story.projectId === projectId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAchievementsByProject(projectId: string): Achievement[] {
  return achievements.filter((achievement) => achievement.projectId === projectId);
}

export function getLatestStories(limit = 4): Story[] {
  return [...stories]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getFeaturedPeople(projectId: string, limit = 6): Person[] {
  return getPeopleByProject(projectId).slice(0, limit);
}

export function getProjectsByYear(): Array<{ year: number; projects: Project[] }> {
  const groups = new Map<number, Project[]>();
  for (const project of projects) {
    groups.set(project.year, [...(groups.get(project.year) ?? []), project]);
  }

  return Array.from(groups.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, yearProjects]) => ({
      year,
      projects: yearProjects.sort((a, b) => b.startDate?.localeCompare(a.startDate ?? "") ?? 0),
    }));
}

export function getRelatedStories(currentStory: Story, limit = 3): Story[] {
  return stories
    .filter(
      (story) =>
        story.id !== currentStory.id &&
        (story.projectId === currentStory.projectId ||
          story.category === currentStory.category),
    )
    .slice(0, limit);
}

export function getProjectTitle(projectId: string) {
  return getProjectById(projectId)?.title ?? "实践项目占位";
}
