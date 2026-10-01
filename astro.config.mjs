import { defineConfig, envField } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://nienke.dev",
  adapter: vercel(),
  env: {
    schema: {
      // Upstash Redis (guestbook + hit counter), provisioned via Vercel
      KV_REST_API_URL: envField.string({ context: "server", access: "secret" }),
      KV_REST_API_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      // Read-only WaniKani personal access token, for the kanji card
      WANIKANI_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [mdx(), react()],
});
