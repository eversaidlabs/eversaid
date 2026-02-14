import { NextResponse } from 'next/server'

/**
 * Runtime config endpoint.
 *
 * Returns configuration that needs to be read at request time (not build time).
 * This supports the single Docker image pattern where the same build is used
 * across staging/production with different env vars.
 */
export async function GET() {
  return NextResponse.json({
    environment: process.env.ENVIRONMENT || 'development',
    posthog: {
      key: process.env.POSTHOG_KEY || '',
      host: process.env.POSTHOG_HOST || '/ingest',
    },
  })
}
