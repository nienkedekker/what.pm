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
      name: "name",
      message: "message",
      parentType: "parentType",
      parentSlug: "parentSlug",
      createdAt: "createdAt",
    },
    prepare({ name, message, parentType, parentSlug, createdAt }) {
      const date = createdAt
        ? new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";
      const truncatedMessage =
        message && message.length > 50 ? message.substring(0, 50) + "..." : message;
      return {
        title: `${name} on ${parentType}/${parentSlug}`,
        subtitle: `${date} — ${truncatedMessage}`,
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
