/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH ?? '';

const nextConfig = {
  // Disabled: Strict Mode double-mounts components in dev, which destroys and
  // recreates the WebGL context on the same canvas. regl cannot reliably
  // reinitialise GPU resources (FBOs, textures) on a context that was just torn
  // down, causing the ASCII post-process pipeline to render black.
  reactStrictMode: false,
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
