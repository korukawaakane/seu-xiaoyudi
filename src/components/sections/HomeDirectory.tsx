import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Landmark,
  Newspaper,
  PackageOpen,
  Search,
} from "lucide-react";
import { Container } from "@/src/components/ui/Container";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const directoryItems = [
  {
    title: "团队简介",
    description: "初衷、发展历程与团队荣誉",
    href: "/about",
    icon: Landmark,
  },
  {
    title: "活动动态",
    description: "调研进展、实践日志与活动报道",
    href: "/stories",
    icon: Newspaper,
  },
  {
    title: "英烈档案",
    description: "一人一档整理生平、事迹与精神关键词",
    href: "/people",
    icon: BookOpenText,
  },
  {
    title: "产品展示",
    description: "课程、折页、视频与调研成果",
    href: "/achievements",
    icon: PackageOpen,
  },
  {
    title: "站内搜索",
    description: "跨栏目查找人物、活动与产品",
    href: "/search",
    icon: Search,
  },
];

export function HomeDirectory() {
  return (
    <section className="section-space bg-white">
      <Container>
        <SectionHeading
          eyebrow="内容导航"
          title="从这里了解“小雨滴”"
          description="一级栏目按内容类型划分；实践专题和历年索引作为资料之间的辅助线索。"
        />
        <div className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-5">
          {directoryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="group border-b border-line px-5 py-6 transition hover:bg-paper sm:border-r lg:border-b-0"
                href={item.href}
                key={item.href}
              >
                <Icon aria-hidden="true" className="text-brand" size={22} />
                <h2 className="mt-5 font-serif text-xl font-semibold text-ink group-hover:text-brand">
                  {item.title}
                </h2>
                <p className="mt-3 min-h-12 text-sm leading-6 text-muted">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  查看栏目
                  <ArrowRight aria-hidden="true" size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
