/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Empty config to satisfy Vercel/Turbopack if needed
    turbo: {}
  }
};

export default nextConfig;
