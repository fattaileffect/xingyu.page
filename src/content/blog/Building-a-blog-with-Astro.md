---
title: "Building a static blog with Astro instead of Next.js"
description: "I have tried to build a static blog using both Next.js and Astro, with Astro being the simpler method."
pubDate: "Feb 20 2023"
---

## Background

The first front-end framework I came across was Next.js, so I set up my [first Chinese blog](https://www.xushilu.com) during college, but considering my future career while setting up this English blog, but this time I am considering Astro, this article will explain why I chose Astro and my attitude towards front-end and back-end separation.

## SSG

Static site generator is still the preferred choice for building a static website with content that does not need to be updated very quickly and very few dynamic components, and while Next.js could do this once, it seems to be [intentionally misleading in its documentation](https://github.com/vercel/next.js/issues/36431) . The `next/image` API does not support `next export`. Either it must use a loader (outside of the dependency framework) or it can only use `<img>` to export static HTML.

But I still think `next/image` is behind the Next.js frontend framework + Vercel services business model is excellent, vercel not only provides image optimization and edge functions, from Next.js 12 onwards, the team's direction is more catering to the needs of large corporate websites(ISR/Edge function), rather than a static site generator.

So for me, not having majored in computer science in college, it was more important to figure out how to make things simple, the code for this blog is on [github](https://github.com/fattaileffect/xingyu.page).

First is the [content collection](https://docs.astro.build/en/guides/content-collections/):

```js
// /src/layouts/BlogLayout.astro
---
import type { CollectionEntry } from "astro:content";
type Props = CollectionEntry<"blog">["data"];
const { title, description, pubDate, updatedDate } = Astro.props;
---

<h1>{title}</h1>
<slot />
```

```js
// /src/pages/blog/[...slug].astro
---
import BlogPost from '../../layouts/BlogPost.astro';
import { CollectionEntry, getCollection } from 'astro:content';
---

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.slug },
		props: post,
	}));
}
type Props = CollectionEntry<'blog'>;

const post = Astro.props;
const { Content } = await post.render();
---
<Content />
```

The important thing is that Astro offers some [built-in integrations](https://docs.astro.build/en/guides/integrations-guide/), RSS, sitemap, mdx, etc., and there is almost no configuration required!

```js
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
```

When finishing `astro build`, Static HTML will be in the `/dist` folder. The tedious development process in Next.js is solved very easily in Astro.

## Business

Vercel has a freemium and open source business model. vercel profits from providing a hosted serverless platform for front-end applications. There are three main categories of products:

1. Hobby: They have an open source software called "Hobby" which is a free product they use to get customers to test the platform (I am using it!).

2. Pro: These are $20 per user per month subscriptions. This is their premium core product.

3. Enterprise: These are custom solutions and pricing for large, undisclosed enterprises, but they provide companies with more network security features and advanced speed capabilities.

As I mentioned above, features such as image optimization and edge functions are based on Next.js as an appendage to the front-end framework, it would be difficult to quickly rebuild without Vercel, for example, on cloudflare to optimize images, either using cloudflare workers (which offers a free monthly credit) or using cloudflare $5 per month for image optimization at the CDN level, I'm not saying most developers have such a need, Vercel use Next.js open source to attract countless developers, but also see [more and more large sites migrates](https://vercel.com/blog/category/customers) and use Vercel + Next.js on, this is a successful open source business story, Next.js is open through an MIT license, which means that a "freely distributable" software must work perfectly "under certain conditions", while integrating the resources of global data centers, Edge functions are server-side TypeScript functions that are distributed globally at the edge, while being close to the user, it also makes it possible to process close to home, a kind of vertical integration of the industry chain.

In theory, it reduces the latency of pulling dynamic information, such a framework is called JAMStack, which stands for JavaScript, APIs, Markup, and the problem of handling back-end data is provided by headless CMS, which has grown rapidly in recent years.

Cloudflare has built a lot of excellent services, such as CDN and workers, but they tend to be independent, and now that Cloudflare is rolling out object storage COS, it still does not have vertical integration for web development. It instead launched for Wordpress $5 or $20 per month CDN-based optimization services, but CDN is not a necessity, Cloudflare is not integrated with Wordpress vps cloud services company, I think the need to build a site is a quick start without too much configuration, if you have used Wordpress will understand its complexity.

This is something Cloudflare lacks, and it is very much not focused on the development experience, which is what I found after watching the Next.js Conf 2021 and 2022, "easy to get started" or "out of the box" I think is the key to the success of open source in the web development business, as demonstrated by the success of the B2B marketing model at the Next.js Conf 2022.

Recommended Reading:

Contrary Research. (2022). Report: Vercel’s Business Breakdown & Founding Story. Contrary Research. https://research.contrary.com/reports/vercel

‌
