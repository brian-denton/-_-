/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

// SHA-256 hashes for allowed inline scripts (Next.js runtime scripts)
const allowedScriptHashes = [
  'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=',
  'sha256-eMuh8xiwcX72rRYNAGENurQBAcH7kLlAUQcoOri3BIo=',
  'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=',
  'sha256-iN2QARMgAWgIVqNMtdjrWUqBl6Q88qsePHXK/EHMaaE=',
  'sha256-Fm/b47xMbWEqOAlYs0Y/YVY/nEQG53ELYMRl67H+f8Q=',
  'sha256-wYPt/hs49AsazRHIbTberl3ETdb09T5GD8Rrv8xD1ww=',
];

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: isDev
      ? "default-src 'self'; img-src 'self' data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; font-src 'self' data:;"
      : `default-src 'self'; img-src 'self' data:; script-src 'self' ${allowedScriptHashes.map(hash => `'${hash}'`).join(' ')}; style-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self' data:;`,
  },
];

const nextConfig = {
  distDir: 'dist',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
