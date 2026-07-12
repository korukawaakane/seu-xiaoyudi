import type { MetadataRoute } from "next";
import { people } from "@/src/data/people";
import { projects } from "@/src/data/projects";
import { stories } from "@/src/data/stories";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/people", "/stories", "/achievements", "/about"];
  const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
  const personRoutes = people.map((person) => `/people/${person.slug}`);
  const storyRoutes = stories.map((story) => `/stories/${story.slug}`);

  return [...staticRoutes, ...projectRoutes, ...personRoutes, ...storyRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
