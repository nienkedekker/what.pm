import ItemsList from "@/components/items-list";

export default async function YearPage(props: {
  params: Promise<{ year: string }>;
}) {
  const params = await props.params;
  const year = parseInt(params.year, 10);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">📚 Items from {year}</h1>
      <ItemsList year={year} />;
    </main>
  );
}
