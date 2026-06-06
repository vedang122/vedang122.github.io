import { visit } from "unist-util-visit";

/**
 * Rehype plugin: section-number badges for headings.
 *
 * Posts write headings as `## /NN Title`. This plugin moves the `/NN`
 * prefix off the visible text and onto a `data-n` attribute, so the CSS
 * `.prose h2::before { content: attr(data-n) }` renders it as the small
 * mono accent number it was always meant to be — instead of the prefix
 * sitting inline (and the empty ::before + flex gap shoving every heading
 * 14px to the right).
 *
 * This plugin runs before Astro's heading-id pass, so the generated slug
 * is derived from the cleaned text (e.g. `a-mental-model-for-skills`, not
 * `01-a-mental-model-for-skills`). The TOC reads Astro's collected headings,
 * so its links stay in sync automatically.
 */
export default function rehypeSectionNumbers() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      const first = node.children?.[0];
      if (!first || first.type !== "text") return;

      const match = first.value.match(/^\/(\d+)\s+/);
      if (!match) return;

      node.properties = node.properties || {};
      node.properties["data-n"] = `/${match[1]}`;
      first.value = first.value.slice(match[0].length);
    });
  };
}
