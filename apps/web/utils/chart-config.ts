export const chartConfig = {
  Book: {
    label: "Books",
    color: "hsl(var(--chart-1))",
  },
  Movie: {
    label: "Movies",
    color: "hsl(var(--chart-3))",
  },
  Show: {
    label: "Shows",
    color: "hsl(var(--chart-5))",
  },
} as const;

export const order: Record<keyof typeof chartConfig, number> = {
  Book: 1,
  Movie: 2,
  Show: 3,
};
