import type { JSONContent } from "@tiptap/core";

export const handleMultiPage = (doc: JSONContent) => {
  if (!doc.content) return;
  const docContent = doc.content;
  const pages = [] as JSONContent[];

  const pagesWithoutPageNode = docContent.filter((d) => d.type !== "page");
  pages[0] = { type: "doc", attrs: {}, content: pagesWithoutPageNode };

  const pageNodes = docContent.filter((d) => d.type === "page");
  pageNodes.forEach((p) => {
    if (!p.content) return;
    pages.push({ type: "doc", attrs: {}, content: p.content });
  });

  return pages;
};
