/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
      qualities: [60, 75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // এটি যেকোনো ডোমেইনের ছবি লোড করতে দিবে
      },
       {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;