import ItemsList from "@/components/lists/items-list";

export default async function YearPage(props: {
  params: Promise<{ year: string }>;
}) {
  const params = await props.params;
  const year = parseInt(params.year, 10);

  return (
    <main>
      <h1 className="text-5xl font-bold mb-12 -ml-6">{year}</h1>
      <ItemsList year={year} />
    </main>
  );
}
