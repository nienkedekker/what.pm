import { defineType, defineField } from "sanity";
import { BarChartIcon } from "@sanity/icons";

export const siteStats = defineType({
  name: "siteStats",
  title: "Site Stats",
  type: "document",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "hitCount",
      title: "Hit Count",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      hitCount: "hitCount",
    },
    prepare({ hitCount }) {
      return {
        title: "Site Stats",
        subtitle: `${hitCount?.toLocaleString() ?? 0} visitors`,
      };
    },
  },
});
