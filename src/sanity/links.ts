interface Span {
  text: string;
  marks?: string[];
}

interface Block {
  children?: Span[];
  markDefs?: { _key: string; _type: string; href?: string }[];
}

/** Collects every external link (text + href) from a Portable Text body. */
export function extractLinks(body: Block[] = []) {
  return body.flatMap((block) =>
    (block.children ?? []).flatMap((span) => {
      const def = block.markDefs?.find(
        (d) => d._type === "link" && d.href && span.marks?.includes(d._key)
      );
      return def?.href ? [{ text: span.text.trim(), href: def.href }] : [];
    })
  );
}
