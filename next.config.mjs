/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
      qualities: [75, 90],
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