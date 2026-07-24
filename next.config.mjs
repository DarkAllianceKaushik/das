/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.puter.site" },
      { protocol: "https", hostname: "**.vercel.app" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
