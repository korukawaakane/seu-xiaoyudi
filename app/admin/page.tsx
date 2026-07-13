import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FilePenLine, ShieldCheck } from "lucide-react";
import { Container } from "@/src/components/ui/Container";

export const metadata: Metadata = {
  title: { absolute: "内容管理｜SEU“小雨滴”社会实践团" },
  description: "SEU“小雨滴”社会实践团数字档案馆的内容管理入口。",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main>
      <section className="hero-band border-b border-line bg-paper">
        <Container className="py-12 sm:py-18">
          <p className="eyebrow">CONTENT MANAGEMENT</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl">
            SEU“小雨滴”社会实践团内容管理
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            通过 Decap CMS 管理项目、人物、实践纪实与成果资料；保存后由 Git 提交触发 Vercel 自动部署。
          </p>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <section className="grid gap-5 border border-line bg-warm-white p-6 shadow-paper sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <FilePenLine aria-hidden="true" size={19} />
              <span className="text-sm font-semibold">CMS 加载入口</span>
            </div>
            <h2 className="mt-3 font-display text-2xl text-ink">进入内容管理后台</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              首次使用需先完成 GitHub 仓库及 OAuth 代理配置。配置完成后，受邀成员可使用 GitHub 账号登录并提交内容更新。
            </p>
          </div>
          <Link className="button-primary shrink-0" href="/admin/index.html">
            打开 CMS <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </section>

        <section className="mt-6 flex gap-3 border-l-4 border-accent bg-paper px-5 py-4 text-sm leading-7 text-muted">
          <ShieldCheck className="mt-1 shrink-0 text-accent" aria-hidden="true" size={18} />
          <p>
            后台页面已禁止搜索引擎收录；请勿在 CMS 配置中填写密钥。具体启用步骤见项目根目录的 CMS_SETUP.md。
          </p>
        </section>
      </Container>
    </main>
  );
}
