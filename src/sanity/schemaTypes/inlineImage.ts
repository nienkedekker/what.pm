import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const inlineImage = defineType({
  name: "inlineImage",
  title: "Inline Image",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
    }),
  ],
  preview: {
    select: {
      media: "image",
      alt: "alt",
    },
    prepare({ media, alt }) {
      return {
        title: alt || "Inline image",
        media,
      };
    },
  },
});
