import type { Metadata, Viewport } from "next";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { siteConfig } from "@/src/config/site";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.teamName,
  description: "社会实践数字档案与成果展示平台",
  url: siteUrl,
  logo: `${siteUrl}/apple-touch-icon.svg`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SEU“小雨滴”社会实践团｜社会实践数字档案馆",
    template: `%s｜${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    "SEU“小雨滴”社会实践团",
    "社会实践",
    "东南大学",
    "实践档案",
    "青年实践",
  ],
  applicationName: siteConfig.siteName,
  creator: siteConfig.teamName,
  publisher: siteConfig.teamName,
  category: "教育",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    url: "/",
    locale: "zh_CN",
    siteName: siteConfig.siteName,
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        type: "image/svg+xml",
        alt: siteConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: ["/images/og-image.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8C1D1D",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          type="application/ld+json"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
