import { ReactNode } from "react";
import { createClientForServer } from "@/utils/supabase/server";
import { ItemCountBarChartComponent } from "@/components/item-count-bar-chart";
import { ItemType } from "@/types";
import { ChartConfig } from "@/components/ui/chart";

const order: Record<ItemType, number> = {
  Book: 1,
  Movie: 2,
  Show: 3,
};

export default async function StatsPage({ children }: { children: ReactNode }) {
  const supabase = await createClientForServer();
  const { data, error } = await supabase.rpc("get_item_counts");
  const currentYear = new Date().getFullYear();

  const { data: yearsLogged, error: yearsLoggedError } =
    await supabase.rpc("count_logged_years");

  if (error || yearsLoggedError) {
    console.error("Error fetching item counts:", error);
    return <p>Failed to load chart data.</p>;
  }

  const chartConfig = {
    Book: {
      label: "Books",
      color: "hsl(var(--chart-1))",
    },
    Movie: {
      label: "Movies",
      color: "hsl(var(--chart-2))",
    },
    Show: {
      label: "TV Shows",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const formatChartData = (key: "total_count" | "current_year_count") =>
    data
      .sort((a, b) => order[a.itemtype] - order[b.itemtype]) // TypeScript now recognizes itemtype correctly
      .map(({ itemtype, [key]: count }) => ({
        type: itemtype,
        count,
        fill:
          chartConfig[itemtype as keyof typeof chartConfig]?.color || "gray",
      }));

  const chartData = formatChartData("total_count");
  const chartDataCurrentYear = formatChartData("current_year_count");

  return (
    <main className="mx-auto container flex flex-col gap-4">
      <h1>Stats</h1>
      <div className="grid grid-cols-2 gap-4">
        <ItemCountBarChartComponent
          chartData={chartData}
          config={chartConfig}
          title="Items over time"
        >
          <div className="flex gap-2 font-medium leading-none">
            Total items logged across {yearsLogged} distinct years
          </div>
          <div className="leading-none text-muted-foreground">
            Displaying counts of Books, Movies, and TV Shows logged across all
            years.
          </div>
        </ItemCountBarChartComponent>
        <ItemCountBarChartComponent
          config={chartConfig}
          chartData={chartDataCurrentYear}
          title={`Items in ${currentYear}`}
        >
          <div className="flex gap-2 font-medium leading-none">
            Total items logged in {currentYear}
          </div>
          <div className="leading-none text-muted-foreground">
            Displaying counts of Books, Movies, and TV Shows logged this year.
          </div>
        </ItemCountBarChartComponent>
      </div>
    </main>
  );
}
