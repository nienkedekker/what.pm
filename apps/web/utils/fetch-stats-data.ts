import { createClientForServer } from "@/utils/supabase/server";
import { order, chartConfig } from "@/utils/chart-config";
import { ItemCountEntry } from "@/types";

export async function fetchStatsData() {
  const supabase = await createClientForServer();
  const currentYear = new Date().getFullYear();

  const [
    { data: itemCountsData, error: itemCountsError },
    { data: yearsLogged, error: yearsLoggedError },
    { data: cumItemsData, error: cumItemsError },
  ] = await Promise.all([
    supabase.rpc("get_item_counts"),
    supabase.rpc("count_logged_years"),
    supabase.rpc("get_cumulative_item_counts"),
  ]);

  if (itemCountsError)
    console.error("Error fetching item counts:", itemCountsError);
  if (yearsLoggedError)
    console.error("Error fetching years logged:", yearsLoggedError);
  if (cumItemsError)
    console.error("Error fetching cumulative items:", cumItemsError);

  if (!itemCountsData && !yearsLogged && !cumItemsData) return null;

  const formatChartData = (
    key: keyof Pick<ItemCountEntry, "total_count" | "current_year_count">,
  ) =>
    itemCountsData
      ?.filter((entry): entry is ItemCountEntry =>
        ["Book", "Movie", "Show"].includes(entry.itemtype),
      )
      .sort((a, b) => order[a.itemtype] - order[b.itemtype])
      .map((entry) => ({
        type: entry.itemtype,
        count: entry[key],
        fill: chartConfig[entry.itemtype]?.color || "hsl(var(--chart-1))",
      }));

  return {
    chartData: formatChartData("total_count"),
    chartDataCurrentYear: formatChartData("current_year_count"),
    chartDataCum: cumItemsData
      ?.sort((a, b) => a.log_year - b.log_year)
      .map(({ log_year, book_total, movie_total, show_total }) => ({
        year: log_year,
        Book: book_total,
        Movie: movie_total,
        Show: show_total,
      })),
    yearsLogged: yearsLogged ?? 0,
    currentYear,
  };
}
