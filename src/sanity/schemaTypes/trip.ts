import { defineType, defineField } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";
import { richTextBlock } from "./shared/richText";

export const trip = defineType({
  name: "trip",
  title: "Trip",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        richTextBlock,
        { type: "image", options: { hotspot: true } },
        { type: "gallery" },
        { type: "code" },
      ],
    }),
    defineField({
      name: "draft",
      title: "Draft",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      media: "cover",
    },
    prepare({ title, location, media }) {
      return {
        title,
        subtitle: location,
        media,
      };
    },
  },
});
