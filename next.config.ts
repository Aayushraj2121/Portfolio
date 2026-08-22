import type { NextConfig } from 'next';

/**
 * Static export — the site is published as plain HTML on GitHub Pages
 * (user site at the root domain, so no basePath/assetPrefix is needed).
 *
 * `images.unoptimized` is required by `output: 'export'`: there is no server to
 * run the optimizer. Images are pre-sized and converted to WebP ahead of time by
 * scripts/build_assets.py, so next/image is still used for its lazy-loading and
 * layout-shift guarantees — just not for resizing.
 */
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
