import type { Achievement } from "@/src/types";
import { loadCmsCollection } from "@/src/data/loadCmsCollection";

const achievementModules = import.meta.glob("../content/achievements/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Achievement>;

export const achievements: Achievement[] = loadCmsCollection(achievementModules);
