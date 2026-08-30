import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // The Telegram import posts the parsed messages as one Server Action
      // payload. Vercel caps a serverless request body at 4.5 MB regardless of
      // what is configured here, so this stays under that ceiling — a limit
      // above it would fail at the platform instead of with our own error.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
