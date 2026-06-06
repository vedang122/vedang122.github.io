// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import rehypeSectionNumbers from "./src/plugins/rehype-section-numbers.mjs";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://vedangkarwa.com",

  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],

  markdown: {
    rehypePlugins: [rehypeSectionNumbers],
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: false,
    },
  },

  trailingSlash: "never",
  build: { format: "directory" },
  adapter: cloudflare()
});