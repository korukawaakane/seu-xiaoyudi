import type { Project, TeamMember } from "@/src/types";
import { loadCmsCollection } from "@/src/data/loadCmsCollection";

export const teamMembers: TeamMember[] = [
  {
    id: "team-member-a",
    name: "成员示例甲",
    role: "资料整理",
    description: "负责整理项目的文字材料与归档目录。",
    projectIds: ["project-one"],
  },
  {
    id: "team-member-b",
    name: "成员示例乙",
    role: "影像记录",
    description: "负责记录项目过程中的演示影像材料。",
    projectIds: ["project-one"],
  },
];

const projectModules = import.meta.glob("../content/projects/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Project>;

export const projects: Project[] = loadCmsCollection(projectModules);
