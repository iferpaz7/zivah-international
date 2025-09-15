import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React optimizations
  reactStrictMode: true,
  swcMinify: true,

  // Performance optimizations
  experimental: {
    // Enable optimizePackageImports for better tree shaking
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    // Enable optimizeCss for better CSS optimization
    optimizeCss: true,
    // Enable scrollRestoration for better UX
    scrollRestoration: true,
  },

  // Image optimization
  images: {
    domains: ['localhost', 'zivahinternational.com', 'www.zivahinternational.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression and optimization
  compress: true,

  // Headers for better caching and security
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
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
      }
    }

    // Add bundle analyzer in development
    if (dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      if (process.env.ANALYZE === 'true') {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: true,
          })
        )
      }
    }

    return config
  },

  // Enable source maps in production for debugging
  productionBrowserSourceMaps: false,

  // Optimize CSS
  optimizeFonts: true,

  // PWA and service worker
  // Service worker headers are handled separately

  // Enable trailing slash for better SEO
  trailingSlash: false,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable etag generation
  generateEtags: true,

  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
}

export default nextConfig
