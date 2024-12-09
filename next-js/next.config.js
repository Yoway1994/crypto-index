/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 啟用靜態輸出
  images: {
    unoptimized: true, // 為了支援靜態輸出
  },
};

module.exports = nextConfig;
