import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.haneulcha.com",
  integrations: [mdx(), sitemap(), react(), markdoc(), keystatic()],
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  vite: {
    resolve: {
      alias:
        import.meta.env.PROD &&
        {
          "react-dom/server": "react-dom/server.edge",
        },
    },
  },
});
