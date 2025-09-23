/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    // Enable lazy loading by default
    loading: 'lazy',
    // Add image domains if needed for external images
    domains: ['images.pexels.com', 'example.com'],
    // Configure blur placeholders
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize for development
    if (dev) {
      config.cache = {
        type: 'filesystem',
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
