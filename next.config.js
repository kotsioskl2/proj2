/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['ddtqzdymlsrujlcdacim.supabase.co']
  }
}

module.exports = nextConfig;
