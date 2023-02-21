import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/static";

// https://astro.build/config
export default defineConfig({
  site: "https://xingyu.page",
  integrations: [
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "dracula",
      },
      remarkPlugins: [],
      rehypePlugins: [],
      remarkRehype: {},
      gfm: true,
    }),
    tailwind(),
    sitemap(),
  ],
  output: "static",
  adapter: vercel({
    analytics: true,
  }),
});
