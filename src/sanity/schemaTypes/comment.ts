import { defineType, defineField } from "sanity";
import { CommentIcon } from "@sanity/icons";

export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(1000),
    }),
    defineField({
      name: "parentType",
      title: "Parent Type",
      type: "string",
      options: {
        list: [
          { title: "Trip", value: "trip" },
          { title: "Note", value: "note" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "parentSlug",
      title: "Parent Slug",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editToken",
      title: "Edit Token",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "message",
      parentType: "parentType",
      parentSlug: "parentSlug",
    },
    prepare({ title, subtitle, parentType, parentSlug }) {
      return {
        title,
        subtitle: `${parentType}/${parentSlug}: ${subtitle}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
