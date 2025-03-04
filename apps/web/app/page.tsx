import ItemsList from "@/components/items-list";

export default async function Home() {
  const currentYear = new Date().getFullYear();

  return <ItemsList year={currentYear} />;
}
