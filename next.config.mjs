/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"**google.com",
      },
    ],
    minimumCacheTTL:60*60*4,
  }
};

export default nextConfig;
