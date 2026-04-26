/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // এটি যেকোনো ডোমেইনের ছবি লোড করতে দিবে
      },
    ],
  },
};

export default nextConfig;