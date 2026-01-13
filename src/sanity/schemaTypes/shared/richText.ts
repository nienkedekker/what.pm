import { LinkIcon } from "@sanity/icons";
import type { Rule } from "sanity";

export const richTextBlock = {
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "H4", value: "h4" },
    { title: "Quote", value: "blockquote" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Code", value: "code" },
      { title: "Strikethrough", value: "strike-through" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "External Link",
        fields: [
          {
            name: "href",
            type: "url",
            title: "URL",
            validation: (rule: Rule) =>
              rule.uri({
                scheme: ["http", "https", "mailto"],
              }),
          },
        ],
      },
      {
        name: "internalLink",
        type: "object",
        title: "Internal Link",
        icon: LinkIcon,
        fields: [
          {
            name: "reference",
            type: "reference",
            title: "Reference",
            to: [{ type: "page" }, { type: "note" }, { type: "trip" }],
          },
        ],
      },
    ],
  },
};
