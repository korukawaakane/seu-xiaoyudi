import type { Metadata } from "next";
import { AdminConsole } from "@/src/components/admin/AdminConsole";

export const metadata: Metadata = {
  title: { absolute: "内容管理后台｜SEU“小雨滴”社会实践团" },
  description: "SEU“小雨滴”社会实践团数字档案馆的成员内容管理后台。",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminConsole />;
}
