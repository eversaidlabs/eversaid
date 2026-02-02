import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  // This creates a minimal production bundle that can run without node_modules
  output: 'standalone',
  // Required for PostHog reverse proxy: prevents Next.js from stripping
  // trailing slashes on PostHog API endpoints (e.g. /e/)
  skipTrailingSlashRedirect: true,
  // Reverse proxy for PostHog analytics: routes requests through our domain
  // so they aren't blocked by ad blockers / tracking protection.
  // NOTE: PostHog docs recommend a less obvious path than "/ingest" to avoid
  // filter lists. Consider renaming if blocked in practice.
  // https://posthog.com/docs/advanced/proxy/nextjs
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ]
  },
};

export default withNextIntl(nextConfig);
