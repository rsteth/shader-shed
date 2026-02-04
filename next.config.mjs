/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.glsl': ['raw-loader'],
        '*.vs': ['raw-loader'],
        '*.fs': ['raw-loader'],
        '*.vert': ['raw-loader'],
        '*.frag': ['raw-loader'],
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
    });
    return config;
  },
};

export default nextConfig;
