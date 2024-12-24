// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Match all paths under res.cloudinary.com
      },
    ],
  },
};

module.exports = nextConfig;
