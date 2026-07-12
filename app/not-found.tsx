import Link from "next/link";
import { ArrowRight, Archive } from "lucide-react";
import { WaterDropMark } from "@/src/components/brand/WaterDropMark";
import { Container } from "@/src/components/ui/Container";

export default function NotFound() {
  return (
    <section className="hero-band min-h-[60vh] bg-paper py-20">
      <Container>
        <div className="mx-auto max-w-2xl border border-line bg-white p-8 text-center shadow-soft sm:p-12">
          <WaterDropMark className="mx-auto" />
          <p className="mt-6 text-sm font-semibold text-brand">404 / ARCHIVE NOT FOUND</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">页面或资料暂未收录</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            该地址没有匹配到当前归档资料。后续新增真实项目、人物或文章时，请先在对应数据文件中添加条目。
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="btn-primary" href="/">
              返回首页
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="btn-secondary" href="/projects">
              <Archive aria-hidden="true" size={18} />
              浏览历届实践
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
