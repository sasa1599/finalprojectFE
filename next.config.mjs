/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", 'dmvbrvhgpxqsklacrald.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/system/resources/thumbnails/**',
      },
      {
        protocol: 'https',
        hostname: 'dmvbrvhgpxqsklacrald.supabase.co',
        pathname: '/storage/v1/object/public/user_avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
