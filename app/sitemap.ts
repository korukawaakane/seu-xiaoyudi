import type { MetadataRoute } from "next";
import { getAvailableYears, getPeople, getProjects, getStories } from "@/src/lib/content";

export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, people, stories] = await Promise.all([
    getProjects(),
    getPeople(),
    getStories(),
  ]);
  const years = getAvailableYears(projects);
  const staticRoutes = [
    { route: "", priority: 1 },
    { route: "/projects", priority: 0.9 },
    { route: "/years", priority: 0.8 },
    { route: "/people", priority: 0.8 },
    { route: "/stories", priority: 0.8 },
    { route: "/achievements", priority: 0.8 },
    { route: "/about", priority: 0.6 },
    { route: "/search", priority: 0.4 },
  ];

  return [
    ...staticRoutes.map(({ route, priority }) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...years.map((year) => {
      const yearProjects = projects.filter((project) => project.year === year);
      const lastModified = yearProjects
        .map((project) => project.updatedAt)
        .sort()
        .at(-1);

      return {
        url: `${baseUrl}/years/${year}`,
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    }),
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...people.map((person) => ({
      url: `${baseUrl}/people/${person.slug}`,
      lastModified: new Date(person.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...stories.map((story) => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: new Date(story.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
