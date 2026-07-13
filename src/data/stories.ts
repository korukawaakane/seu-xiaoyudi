import type { Story } from "@/src/types";
import { loadCmsCollection } from "@/src/data/loadCmsCollection";

const storyModules = import.meta.glob("../content/stories/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Story>;

export const stories: Story[] = loadCmsCollection(storyModules);
