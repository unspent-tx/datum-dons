import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' https://*.ytimg.com https://www.youtube.com;
              frame-src 'self' https://www.youtube.com https://youtube.com;
              connect-src 'self' https://*.youtube.com https://*.googlevideo.com;
              media-src 'self' https://*.googlevideo.com;
              frame-ancestors 'self' https://www.youtube.com https://youtube.com;
            `
              .replace(/\s+/g, " ")
              .trim(),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  images: {
    domains: ["www.youtube.com", "youtube.com", "i.ytimg.com"],
  },
};

export default nextConfig;
