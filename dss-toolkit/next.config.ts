import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const repoBasePath = "/digital-security-framework-sl";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        basePath: repoBasePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: 'http://localhost:3001/api/:path*',
            },
          ];
        },
      }),
};

export default nextConfig;
