/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['cdn.sanity.io'],
  },
  swcMinify: true,
  env: {
    JWT_SECRET: 'somethingsecret',
    ADMIN_USER_TOKEN: 'skEAloPNTcA6TAiIdFkI5vnCLmAfkNBf6waWx3t5fOtZnKMfVrGPXfQ2EkGYUV4ltI5Y6SSkx0FoYRgwAcbBENbyBXM3XDVUZZiOtyXPqBcU4c7OoLkY67ZohI5UA7t8EsdQ2i42L9N6bWBShAd4GNTtHDLSXs4qzsWGrVH3WTxDWjoEHSiL',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_51LMHmvAw2oupCOB0ratOnIwxkVfiSrXcoIgacKLEABWow4zf9DYZyvOCIRCGe1kIfRV5cxFIlnBFuXyeBuB0nUbR00uyKu279V',
    STRIPE_SECRET_KEY: 'pk_test_51LMHmvAw2oupCOB0ratOnIwxkVfiSrXcoIgacKLEABWow4zf9DYZyvOCIRCGe1kIfRV5cxFIlnBFuXyeBuB0nUbR00uyKu279V',
    
  },
}

module.exports = nextConfig
