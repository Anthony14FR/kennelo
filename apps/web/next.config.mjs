/* eslint-env node */

// eslint-disable-next-line no-undef
const isMobileBuild = process.env.MOBILE_BUILD === 'true';

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
