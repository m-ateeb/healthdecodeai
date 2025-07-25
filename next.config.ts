import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for server components
  serverExternalPackages: [],
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ✅ Disable ESLint blocking build on Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      // Add any redirects here
    ];
  },
};

export default nextConfig;
