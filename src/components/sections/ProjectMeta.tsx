import type { Project } from "@/src/types";
import { Tag } from "@/src/components/ui/Tag";

type ProjectMetaProps = {
  project: Project;
};

export function ProjectMeta({ project }: ProjectMetaProps) {
  const items = [
    { label: "年份", value: `${project.year}年` },
    { label: "学期", value: project.semester },
    { label: "开始日期", value: project.startDate ?? "待补充" },
    { label: "结束日期", value: project.endDate ?? "待补充" },
    { label: "实践地点", value: project.location },
    { label: "实践主题", value: project.theme },
  ];

  return (
    <div className="grid gap-4 rounded-[8px] border border-line bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-xs font-semibold text-muted">{item.label}</p>
          <p className="mt-1 font-medium text-ink">{item.value}</p>
        </div>
      ))}
      <div>
        <p className="text-xs font-semibold text-muted">项目状态</p>
        <div className="mt-2">
          <Tag tone={project.status === "published" ? "red" : "bronze"}>
            {project.status === "published"
              ? "当前展示"
              : project.status === "archived"
                ? "已归档"
                : "草稿"}
          </Tag>
        </div>
      </div>
    </div>
  );
}
