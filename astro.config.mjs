// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://vedangkarwa.com",
  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      // Two themes ship with the design system's light + dark accents
      themes: { light: "github-light", dark: "github-dark" },
      wrap: false,
    },
  },
  trailingSlash: "never",
  build: { format: "directory" },
});
