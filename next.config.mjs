/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      '*.glsl': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.vs': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.fs': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.vert': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.frag': {
        loaders: ['raw-loader'],
        as: '*.js',
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
