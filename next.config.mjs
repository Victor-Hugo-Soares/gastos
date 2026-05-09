import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Firebase client SDK uses gRPC which is not needed server-side
      config.externals = config.externals || []
    }
    return config
  },
}

const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

export default pwaConfig(nextConfig)
