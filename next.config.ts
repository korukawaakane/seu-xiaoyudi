import type { NextConfig } from "next";

const isCloudBaseStaticExport = process.env.CLOUDBASE_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  output: isCloudBaseStaticExport ? "export" : undefined,
  trailingSlash: isCloudBaseStaticExport ? true : undefined,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: isCloudBaseStaticExport,
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
