import { achievements } from "@/src/data/achievements";
import { people } from "@/src/data/people";
import { projects } from "@/src/data/projects";
import { stories } from "@/src/data/stories";
import type {
  Achievement,
  AchievementType,
  Person,
  Project,
  Semester,
  Story,
  StoryCategory,
} from "@/src/types";

export type ProjectFilters = {
  year?: string;
  semester?: string;
  theme?: string;
  location?: string;
};

export type PeopleFilters = {
  keyword?: string;
  year?: string;
  project?: string;
  category?: string;
  spirit?: string;
};

export type StoryFilters = {
  category?: string;
  project?: string;
  year?: string;
  keyword?: string;
};

export type AchievementFilters = {
  type?: string;
  project?: string;
  year?: string;
  keyword?: string;
};

const newestFirst = (left: Project, right: Project) =>
  right.year - left.year ||
  (right.startDate ?? "").localeCompare(left.startDate ?? "");

const allowedProjectAccents = ["#8C1D1D", "#A67C52", "#333333"];

const stringMatches = (value: string, query?: string) =>
  !query || value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());

export function getFeaturedProject(items: Project[] = projects): Project | undefined {
  return getSortedProjects(items).find((project) => project.featured) ?? getSortedProjects(items)[0];
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
  const project = getProjectById(projectId);
  return people.filter(
    (person) =>
      person.projectIds.includes(projectId) ||
      Boolean(project?.personIds.includes(person.id)),
  );
}

export function getStoriesByProject(projectId: string): Story[] {
  return stories
    .filter((story) => story.projectId === projectId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAchievementsByProject(projectId: string): Achievement[] {
  return achievements
    .filter((achievement) => achievement.projectId === projectId)
    .sort((left, right) => right.publishDate.localeCompare(left.publishDate));
}

export function getLatestStories(limit = 4): Story[] {
  return [...stories]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getFeaturedPeople(projectId: string, limit = 6): Person[] {
  return getPeopleByProject(projectId).slice(0, limit);
}

export function getSortedProjects(items: Project[] = projects): Project[] {
  return [...items].sort(newestFirst);
}

export function getProjectsByYear(items: Project[] = projects): Array<{ year: number; projects: Project[] }> {
  const groups = new Map<number, Project[]>();
  for (const project of items) {
    groups.set(project.year, [...(groups.get(project.year) ?? []), project]);
  }

  return Array.from(groups.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, yearProjects]) => ({
      year,
      projects: getSortedProjects(yearProjects),
    }));
}

export function getRelatedStories(currentStory: Story, limit = 3): Story[] {
  return [...stories]
    .filter(
      (story) =>
        story.id !== currentStory.id &&
        (story.projectId === currentStory.projectId ||
          story.category === currentStory.category),
    )
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, limit);
}

export function getProjectTitle(projectId: string) {
  return getProjectById(projectId)?.title ?? "实践项目占位";
}

export function getStoriesByIds(ids: string[]): Story[] {
  return ids
    .map((id) => stories.find((story) => story.id === id || story.slug === id))
    .filter((story): story is Story => Boolean(story))
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getAvailableYears(items: Project[] = projects): number[] {
  return Array.from(new Set(items.map((project) => project.year))).sort((left, right) => right - left);
}

export function getAvailableSemesters(items: Project[] = projects): Semester[] {
  return Array.from(new Set(items.map((project) => project.semester)));
}

export function getAvailableLocations(items: Project[] = projects): string[] {
  return Array.from(new Set(items.map((project) => project.location))).sort();
}

export function getStoryCategories(items: Story[] = stories): StoryCategory[] {
  return Array.from(new Set(items.map((story) => story.category))).sort();
}

export function getAchievementTypes(items: Achievement[] = achievements): AchievementType[] {
  return Array.from(new Set(items.map((achievement) => achievement.type))).sort();
}

export function filterProjects(
  items: Project[] = projects,
  filters: ProjectFilters = {},
): Project[] {
  return getSortedProjects(items).filter(
    (project) =>
      (!filters.year || String(project.year) === filters.year) &&
      (!filters.semester || project.semester === filters.semester) &&
      (!filters.theme || project.theme === filters.theme) &&
      (!filters.location || project.location === filters.location),
  );
}

export function searchPeople(
  items: Person[] = people,
  projectsById: Project[] = projects,
  filters: PeopleFilters = {},
): Person[] {
  return items.filter((person) => {
    const searchable = [
      person.name,
      person.summary,
      person.biography,
      person.category,
      ...person.keywords,
    ].join(" ");
    const projectsForPerson = projectsById.filter((project) =>
      person.projectIds.includes(project.id),
    );
    return (
      stringMatches(searchable, filters.keyword) &&
      (!filters.project || person.projectIds.includes(filters.project)) &&
      (!filters.category || person.category === filters.category) &&
      (!filters.spirit || person.keywords.includes(filters.spirit)) &&
      (!filters.year || projectsForPerson.some((project) => String(project.year) === filters.year))
    );
  });
}

export function filterStories(
  items: Story[] = stories,
  projectsById: Project[] = projects,
  filters: StoryFilters = {},
): Story[] {
  return [...items]
    .filter((story) => {
      const project = projectsById.find((item) => item.id === story.projectId);
      return (
        (!filters.category || story.category === filters.category) &&
        (!filters.project || story.projectId === filters.project) &&
        (!filters.year || String(project?.year ?? "") === filters.year) &&
        stringMatches([story.title, story.summary, story.category].join(" "), filters.keyword)
      );
    })
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function filterAchievements(
  items: Achievement[] = achievements,
  projectsById: Project[] = projects,
  filters: AchievementFilters = {},
): Achievement[] {
  return [...items]
    .filter((achievement) => {
      const project = projectsById.find((item) => item.id === achievement.projectId);
      return (
        (!filters.type || achievement.type === filters.type) &&
        (!filters.project || achievement.projectId === filters.project) &&
        (!filters.year || String(project?.year ?? "") === filters.year) &&
        stringMatches(
          [achievement.title, achievement.summary, achievement.type].join(" "),
          filters.keyword,
        )
      );
    })
    .sort((left, right) => right.publishDate.localeCompare(left.publishDate));
}

export function getFeaturedStory(items: Story[] = stories): Story | undefined {
  return [...items].sort((left, right) => right.date.localeCompare(left.date))
    .find((story) => story.featured) ?? getLatestStories(1)[0];
}

export function getArchiveStats() {
  const galleryCount =
    projects.reduce((total, project) => total + project.gallery.length, 0) +
    people.reduce((total, person) => total + person.gallery.length, 0) +
    stories.reduce((total, story) => total + story.gallery.length, 0);
  return [
    { label: "收录实践项目", value: String(projects.length), note: "按年份与学期归档" },
    { label: "收录人物档案", value: String(people.length), note: "使用中文占位档案" },
    { label: "发布纪实文章", value: String(stories.length), note: "按日期持续更新" },
    { label: "保存影像资料", value: String(galleryCount), note: "当前为本地占位影像" },
    { label: "收录实践成果", value: String(achievements.length), note: "文件状态由数据决定" },
  ];
}

export function getProjectAccent(themeColor?: string) {
  const color = themeColor?.toUpperCase();
  return color && allowedProjectAccents.includes(color) ? color : allowedProjectAccents[0];
}
