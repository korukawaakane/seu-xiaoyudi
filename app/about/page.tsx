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
  title: "关于我们",
  description: siteConfig.teamName + "社会实践数字档案与成果展示平台介绍。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "关于我们｜SEU“小雨滴”社会实践团",
    description: siteConfig.teamName + "社会实践数字档案与成果展示平台介绍。",
    url: "/about",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "关于 SEU“小雨滴”社会实践团" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "关于我们｜SEU“小雨滴”社会实践团",
    description: siteConfig.teamName + "社会实践数字档案与成果展示平台介绍。",
    images: ["/images/og-image.svg"],
  },
};

const valueIcons = [Droplets, BookOpenText, Archive, Layers3];

export default function AboutPage() {
  const aboutContent = getAboutContent();

  return (
    <>
      <PageHero
        eyebrow="关于我们"
        title={siteConfig.teamName}
        description={siteConfig.secondarySlogan}
        tone="dark"
      >
        <BrandLogo tone="dark" />
      </PageHero>

      <section className="section-space bg-white">
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

      <section className="section-space bg-paper">
        <Container>
          <SectionHeading title="平台内容结构" description="后续真实资料录入时，应保持以下内容边界清晰。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aboutContent.scopes.map((item) => (
              <article className="border-t-2 border-brand/25 bg-white p-5" key={item}>
                <Tag tone="red">{item}</Tag>
                <p className="mt-4 text-sm leading-7 text-muted">这里用于说明{item}的收录标准、资料来源和维护方式。</p>
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
          <SectionHeading title="团队信息占位" description="本阶段不填写真实团队成员、指导老师和联系方式。" />
          <div className="grid gap-4 lg:grid-cols-3">
            {aboutContent.teamPlaceholders.map((item) => (
              <article className="border border-line bg-white p-5" key={item}>
                <h2 className="font-serif text-xl font-semibold text-ink">{item}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">确认真实资料与授权后，再统一录入该部分内容。</p>
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
