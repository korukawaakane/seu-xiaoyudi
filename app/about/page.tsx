import type { Metadata } from "next";
import { Container } from "@/src/components/ui/Container";
import { PageHero } from "@/src/components/ui/PageHero";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { Tag } from "@/src/components/ui/Tag";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "关于我们",
  description: `${siteConfig.teamName}社会实践数字档案与成果展示平台介绍。`,
};

const scopeItems = ["实践项目", "人物档案", "实践纪实", "影像资料", "实践成果", "团队信息"];
const spiritItems = ["点滴汇聚", "持续记录", "青春实践", "精神传承"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="关于我们"
        title={siteConfig.teamName}
        description={`${siteConfig.siteName}用于长期收录团队社会实践项目和相关成果。本阶段仅搭建展示框架，所有人员、联系方式和项目内容均为占位信息。`}
      />

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading
                title="平台介绍"
                description={`这里用于介绍${siteConfig.shortName}社会实践数字档案与成果展示平台的建设背景、内容范围和维护方式。`}
              />
            </div>
            <div>
              <SectionHeading
                title="建设目的"
                description="通过统一的数据结构和页面模板，保存往届实践内容，降低后续新增项目、人物和成果时的维护成本。"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="内容收录范围" description="后续真实资料录入时，应保持以下内容边界清晰。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scopeItems.map((item) => (
              <div className="rounded-[8px] border border-line bg-white p-5 shadow-soft" key={item}>
                <Tag tone="red">{item}</Tag>
                <p className="mt-4 text-sm leading-7 text-muted">
                  这里用于说明{item}的收录标准、资料来源和维护方式。
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="团队精神" description="以“小雨滴”的概念表达点滴汇聚与持续记录，保持庄重克制。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {spiritItems.map((item) => (
              <div className="rounded-[8px] border border-line bg-paper p-5" key={item}>
                <p className="font-serif text-xl font-semibold text-brand">{item}</p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  团队精神说明占位，后续可替换为正式表述。
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <SectionHeading title="团队信息占位" description="本阶段不填写真实团队成员、指导老师和联系方式。" />
          <div className="grid gap-4 lg:grid-cols-3">
            {["团队成员占位", "指导老师占位", "历届团队占位"].map((item) => (
              <div className="rounded-[8px] border border-line bg-white p-5 shadow-soft" key={item}>
                <h2 className="font-serif text-xl font-semibold text-ink">{item}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  后续在确认真实资料和授权后，再统一录入该部分内容。
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading title="维护与说明" description="以下为后续运营前需要完善的基础说明。" />
          <div className="grid gap-4 lg:grid-cols-3">
            {["联系方式占位", "资料来源说明", "版权说明", "网站维护说明"].map((item) => (
              <div className="rounded-[8px] border border-line bg-paper p-5" key={item}>
                <h2 className="font-semibold text-ink">{item}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  这里用于填写{item}，当前仅作为结构占位。
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
