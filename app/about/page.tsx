import type { Metadata } from "next";
import { Archive, BookOpenText, Droplets, Layers3 } from "lucide-react";
import { BrandLogo } from "@/src/components/brand/BrandLogo";
import { RippleDecoration } from "@/src/components/brand/RippleDecoration";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { Tag } from "@/src/components/ui/Tag";
import { siteConfig } from "@/src/config/site";
import { getAboutContent } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "团队简介",
  description: siteConfig.teamName + "的成立初衷、发展历程、团队荣誉与组织传承。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "团队简介｜SEU“小雨滴”社会实践团",
    description: siteConfig.teamName + "的成立初衷、发展历程、团队荣誉与组织传承。",
    url: "/about",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "SEU“小雨滴”社会实践团团队简介" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "团队简介｜SEU“小雨滴”社会实践团",
    description: siteConfig.teamName + "的成立初衷、发展历程、团队荣誉与组织传承。",
    images: ["/images/og-image.svg"],
  },
};

const valueIcons = [Droplets, BookOpenText, Archive, Layers3];

export default function AboutPage() {
  const aboutContent = getAboutContent();

  return (
    <>
      <PageHero
        eyebrow="团队简介"
        title={siteConfig.teamName}
        description="从团队初衷出发，梳理发展历程、集体荣誉与历届成员的实践传承。"
        tone="dark"
      >
        <BrandLogo tone="dark" />
      </PageHero>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading
            eyebrow="团队概览"
            title="初衷、历史与荣誉"
            description="三部分各自承担明确内容，避免团队介绍与实践项目资料混在一起。"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {aboutContent.profileSections.map((item, index) => (
              <article className="border-t-2 border-brand bg-paper p-6" key={item.title}>
                <p className="text-sm font-semibold text-brand">0{index + 1}</p>
                <h2 className="mt-5 font-serif text-2xl font-semibold text-ink">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading title="团队与平台" description={aboutContent.platform} />
              <p className="max-w-2xl text-base leading-8 text-muted">{siteConfig.description}</p>
            </div>
            <div className="border-l-2 border-brand/35 pl-6">
              <SectionHeading title="建设目的" description={aboutContent.purpose} />
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading title="网站内容分区" description="每类内容只承担一种主要职责，项目和年份仅作为关联索引。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aboutContent.scopes.map((item) => (
              <article className="border-t-2 border-brand/25 bg-paper p-5" key={item}>
                <Tag tone="red">{item}</Tag>
                <p className="mt-4 text-sm leading-7 text-muted">集中整理{item}，并保留必要的来源和关联信息。</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden section-space bg-white">
        <RippleDecoration />
        <Container className="relative z-10">
          <SectionHeading title="点滴汇聚" description="以“小雨滴”的概念表达一次实践、一段记录与长期积累之间的关系。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutContent.values.map((item, index) => {
              const Icon = valueIcons[index];
              return (
                <article className="border border-line bg-paper p-5" key={item}>
                  <Icon aria-hidden="true" className="text-brand" size={24} />
                  <p className="mt-5 font-serif text-xl font-semibold text-ink">{item}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">团队理念说明占位，后续可替换为正式表述。</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading title="团队组成" description="指导教师、项目成员与历届团队分别整理，避免名单与团队历史混排。" />
          <div className="grid gap-4 lg:grid-cols-3">
            {aboutContent.teamPlaceholders.map((item) => (
              <article className="border border-line bg-white p-5" key={item}>
                <h2 className="font-serif text-xl font-semibold text-ink">{item}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">相关名单与介绍将在资料确认并获得授权后统一补充。</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space bg-white">
        <Container>
          <SectionHeading title="维护、来源与版权" description="以下信息为后续长期运营前需要完善的基础说明。" />
          <div className="grid gap-4 lg:grid-cols-4">
            {aboutContent.maintenance.map((item) => (
              <article className="border-l-2 border-bronze bg-paper p-5" key={item}>
                <h2 className="font-semibold text-ink">{item}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">这里用于填写{item}，当前仅作为结构占位。</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
