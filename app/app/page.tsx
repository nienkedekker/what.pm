import ItemsList from "@/components/items-list";

export default async function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-amber-200 mx-auto container">
      <ItemsList year={currentYear} />
    </div>
  );
}
