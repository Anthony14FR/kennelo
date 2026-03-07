/* global process */
import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isMobileBuild = process.env.NEXT_PUBLIC_PLATFORM === 'mobile';

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@workspace/ui"],
    turbopack: {
        root: join(__dirname, '../../'),
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        })
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
        ],
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