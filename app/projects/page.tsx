import type { Metadata } from "next";
import { ProjectsExplorer } from "@/src/components/filters/ProjectsExplorer";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { getProjects } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "历届实践",
  description: "按年份、学期、主题和地点浏览历届社会实践项目。",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "历届实践｜SEU“小雨滴”社会实践团",
    description: "按年份、学期、主题和地点浏览历届社会实践项目。",
    url: "/projects",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "历届实践项目" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "历届实践｜SEU“小雨滴”社会实践团",
    description: "按年份、学期、主题和地点浏览历届社会实践项目。",
    images: ["/images/og-image.svg"],
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHero
        eyebrow="历届实践"
        title="按年份与学期持续归档"
        description="所有实践项目共用统一数据结构和详情模板；后续新增学期时，只需添加新的项目数据。"
        stat={{ value: String(projects.length), label: "个已收录项目" }}
      />
      <section className="section-space bg-paper">
        <Container>
          <ProjectsExplorer projects={projects} />
        </Container>
      </section>
    </>
  );
}
