import type { Person } from "@/src/types";
import { loadCmsCollection } from "@/src/data/loadCmsCollection";

const personModules = import.meta.glob("../content/people/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Person>;

export const people: Person[] = loadCmsCollection(personModules);
