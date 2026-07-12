import type { Metadata } from "next";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { siteConfig } from "@/src/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${siteConfig.teamName}｜社会实践数字档案馆`,
    template: `%s｜${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    locale: "zh_CN",
    siteName: siteConfig.siteName,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
