/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          "files.edgestore.dev"
        ]
      },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      stream: false,
      zlib: false
    };
    
    return config;
  },
};

module.exports = nextConfig
