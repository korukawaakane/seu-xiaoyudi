import Link from "next/link";
import { Container } from "@/src/components/ui/Container";

export default function NotFound() {
  return (
    <section className="bg-paper py-20">
      <Container>
        <div className="mx-auto max-w-2xl rounded-[8px] border border-line bg-white p-8 text-center shadow-soft">
          <p className="text-sm font-semibold text-brand">404</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
            页面或资料暂未收录
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            该 slug 没有匹配到当前占位数据。后续新增真实项目、人物或文章时，请先在数据文件中添加对应条目。
          </p>
          <Link className="btn-primary mt-6" href="/">
            返回首页
          </Link>
        </div>
      </Container>
    </section>
  );
}
