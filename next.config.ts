import type { NextConfig } from "next";
import {
  NEXT_PUBLIC_IMAGE_HOSTNAME,
  NEXT_PUBLIC_IMAGE_PROTOCOL,
} from "./config/main";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: NEXT_PUBLIC_IMAGE_PROTOCOL,
        hostname: NEXT_PUBLIC_IMAGE_HOSTNAME,
        port: "", // Remove the port since Nginx serves Laravel
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
