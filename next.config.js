/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Enable static exports
    images: {
      unoptimized: true,  // Required for static exports
    },
    // This is important for resolving the "self is not defined" issue
    // as it prevents some browser-only code from running during SSR
    experimental: {
      serverComponentsExternalPackages: [],
    },
  };
  
  module.exports = nextConfig;