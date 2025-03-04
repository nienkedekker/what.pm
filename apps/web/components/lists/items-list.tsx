import { createClientForServer } from "@/utils/supabase/server";
import Link from "next/link";
import DeleteItemDialog from "./delete-item-dialog";
import { Button } from "@/components/ui/button";
import { Item } from "@/types";

interface CategoryListProps {
  categoryTitle: string;
  items: Item[];
  isLoggedIn?: boolean;
}

export async function CategoryList({
  categoryTitle,
  items,
  isLoggedIn,
}: CategoryListProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-bold -ml-4">{categoryTitle}</h2>
      {items.length > 0 ? (
        <ol className="list-decimal list-outside text-gray-400 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="pl-4">
              <span className="text-gray-700 dark:text-gray-500">
                {item.itemtype === "Book" && `${item.author}, `}
                <span className="text-sky-900 dark:text-sky-200">
                  {item.title}
                </span>
                {item.itemtype === "Movie" &&
                  ` (${item.director || "Unknown Director"}, ${item.published_year})`}
                {item.itemtype === "Show" &&
                  ` (season ${item.season || "Unknown"})`}
              </span>
              {isLoggedIn && (
                <div className="flex gap-2">
                  <Button
                    asChild
                    className="text-xs p-0 cursor-pointer"
                    variant="link"
                  >
                    <Link href={`/item/${item.id}`}>Update</Link>
                  </Button>
                  <DeleteItemDialog
                    itemId={item.id}
                    belongsToYear={item.belongs_to_year}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-500 italic -ml-4">
          No {categoryTitle.toLowerCase()} logged this year.
        </p>
      )}
    </div>
  );
}

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-32">
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
