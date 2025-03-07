import { createClientForServer } from "@/utils/supabase/server";
import { CategoryList } from "@/components/lists/category-list";

export default async function ItemsList({ year }: { year: number }) {
  const supabase = await createClientForServer();
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("belongs_to_year", year)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
    return <p>Failed to load data.</p>;
  }

  const categories = [
    { title: "Books", type: "Book" },
    { title: "Movies", type: "Movie" },
    { title: "TV Shows", type: "Show" },
  ];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-32 px-6">
      {categories.map(({ title, type }) => (
        <CategoryList
          key={type}
          categoryTitle={title}
          isLoggedIn={!!user}
          items={items.filter((item) => item.itemtype === type)}
        />
      ))}
    </div>
  );
}
