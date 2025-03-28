/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'bytklkkdewxuxlfznweg.supabase.co', // Supabase storage domain
      'unpkg.com', // For Leaflet marker icons
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bytklkkdewxuxlfznweg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
