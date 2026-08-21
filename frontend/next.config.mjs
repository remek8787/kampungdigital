/** @type {import('next').NextConfig} */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "/kampungdigital").replace(/\/$/, "");

const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
};

export default nextConfig;
