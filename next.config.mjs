/** Security headers applied to all routes */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; img-src 'self' https: data:; object-src 'none';",
  },
  {
    key: 'Referrer-Policy',
    value: 'same-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'off',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist',
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
