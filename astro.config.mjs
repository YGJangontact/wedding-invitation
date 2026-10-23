import { defineConfig } from "astro/config";
export default defineConfig({
  output: "static",
  site: "https://ygjangontact.github.io",
  base: process.env.GITHUB_ACTIONS === "true" ? "/wedding-invitation" : "/",
  devToolbar: { enabled: false },
});
