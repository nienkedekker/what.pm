import { fetchStatsData } from "@/utils/fetch-stats-data";
import { ItemCountBarChart } from "@/components/charts/item-count-bar-chart";
import { CumulativeLineChart } from "@/components/charts/cumulative-line-chart";
import { ChartConfig } from "@/components/ui/chart";

export default async function StatsPage() {
  const statsData = await fetchStatsData();

  if (!statsData) return <p>Failed to load chart data.</p>;

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
      label: "Shows",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const {
    chartData,
    chartDataCurrentYear,
    chartDataCum,
    yearsLogged,
    currentYear,
  } = statsData;

  return (
    <div className="flex flex-col gap-4">
      <h1>Stats</h1>
      <div className="grid lg:grid-cols-2 gap-4">
        <ItemCountBarChart
          chartData={chartData ?? []}
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
        </ItemCountBarChart>
        <ItemCountBarChart
          config={chartConfig}
          chartData={chartDataCurrentYear ?? []}
          title={`Items in ${currentYear}`}
        >
          <div className="flex gap-2 font-medium leading-none">
            Total items logged in {currentYear}
          </div>
          <div className="leading-none text-muted-foreground">
            Displaying counts of Books, Movies, and TV Shows logged this year.
          </div>
        </ItemCountBarChart>
      </div>
      <CumulativeLineChart
        chartData={chartDataCum ?? []}
        config={chartConfig}
      />
    </div>
  );
}
