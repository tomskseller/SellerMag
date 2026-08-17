/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // удобно для Docker-образа
};

module.exports = nextConfig;
