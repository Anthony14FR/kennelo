/* global process */

const isMobileBuild = process.env.NEXT_PUBLIC_PLATFORM === 'mobile';

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@workspace/ui"],

  ...(isMobileBuild && {
    output: 'export',
    images: {
      unoptimized: true,
    },
  }),
}

export default nextConfig
