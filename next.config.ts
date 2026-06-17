import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wlojxqlspxqficpyppby.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  typescript: {
    // ВНИМАНИЕ: Это позволит проекту собраться, даже если есть ошибки TypeScript.
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);