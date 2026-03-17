/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ['next-mdx-remote'],
  cacheComponents: true,
  images:{
    minimumCacheTTL:60*60*4,
  }
};

export default nextConfig;
