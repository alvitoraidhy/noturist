/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_URL: process.env.API_URL || "/api",
    SECRET_KEY:
      process.env.SECRET_KEY ||
      require("crypto").randomBytes(48).toString("hex"),
  },
};

module.exports = nextConfig;
