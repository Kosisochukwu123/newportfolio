
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
  prerender: [
    "/",
    "/contact",
    "/team",
    "/resume",
  ],
} satisfies Config;
