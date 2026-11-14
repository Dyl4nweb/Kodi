/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
