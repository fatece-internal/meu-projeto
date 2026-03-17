import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  turbopack: {},
  transpilePackages: ['@algebraquest/shared'],
}

export default nextConfig
