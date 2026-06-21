/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Dev only: proxy /api/* to local Express server
    if (process.env.NODE_ENV === 'production') return [];
    return [
      { source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' },
    ];
  },
};

export default nextConfig;
