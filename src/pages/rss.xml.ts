import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "Vedang Karwa",
    description:
      "Notes from inside the 0→1. LLMs, leverage, and shipping software at a startup.",
    site: context.site!,
    items: posts.map(p => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/posts/${p.slug}/`,
      categories: [p.data.tag],
    })),
    customData: `<language>en-us</language>`,
  });
}
