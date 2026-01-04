import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://nienke.dev",
  adapter: vercel(),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [
    mdx(),
    sanity({
      projectId: "vuh5pxn1",
      dataset: "production",
      useCdn: false,
    }),
    react(),
  ],
});
