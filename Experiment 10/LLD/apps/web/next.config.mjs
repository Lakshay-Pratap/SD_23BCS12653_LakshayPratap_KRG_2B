import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@campusconnect/shared"],
  outputFileTracingRoot: path.join(currentDirectory, "../..")
};

export default nextConfig;
