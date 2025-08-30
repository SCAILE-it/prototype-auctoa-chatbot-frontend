// Minimal HTML utilities for safe rendering without external deps

export const isLikelyHtml = (value: unknown): boolean => {
  return typeof value === "string" && /<\s*\w|&lt;\s*\w/i.test(value);
};

export const sanitizeHtml = (input: unknown): string => {
  if (typeof input !== "string" || !input) return "";

  // If no DOM is available (SSR), perform a very conservative strip of script tags
  if (typeof document === "undefined") {
    return input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  }

  const disallowedTags = new Set([
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
  ]);

  const template = document.createElement("template");
  template.innerHTML = input;

  const walk = (root: Node) => {
    const children = Array.from(root.childNodes);
    for (const node of children) {
      if (node.nodeType === 1) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (disallowedTags.has(tag)) {
          el.remove();
          continue;
        }

        // Remove risky attributes (event handlers, inline styles, ids)
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const name = attr.name.toLowerCase();
          const value = attr.value || "";
          if (name.startsWith("on") || name === "style" || name === "id") {
            el.removeAttribute(attr.name);
            continue;
          }
          if (name === "href" || name === "src") {
            const v = value.trim();
            const isSafeRef =
              /^https?:/i.test(v) || /^mailto:/i.test(v) || /^tel:/i.test(v) || /^#/i.test(v);
            if (!isSafeRef) {
              el.removeAttribute(attr.name);
            }
            if (name === "href") {
              const existingRel = el.getAttribute("rel") || "";
              const relSet = new Set(existingRel.split(/\s+/).filter(Boolean));
              relSet.add("nofollow");
              relSet.add("noopener");
              relSet.add("noreferrer");
              el.setAttribute("rel", Array.from(relSet).join(" "));
              el.setAttribute("target", "_blank");
            }
          }
        }

        walk(el);
      } else if (node.nodeType === 8) {
        // Strip HTML comments
        node.parentNode?.removeChild(node);
      }
    }
  };

  walk(template.content);
  return template.innerHTML;
};


