/* global process */
import createNextIntlPlugin from 'next-intl/plugin';

const isMobileBuild = process.env.NEXT_PUBLIC_PLATFORM === 'mobile';

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@workspace/ui"],
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        })
        return config
    },

    ...(isMobileBuild && {
        output: 'export',
        images: {
            unoptimized: true,
        },
    }),
}

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');
export default withNextIntl(nextConfig);