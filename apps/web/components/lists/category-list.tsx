import Link from "next/link";
import DeleteItemDialog from "./delete-item-dialog";
import { Button } from "@/components/ui/button";
import { Item } from "@/types";

interface CategoryListProps {
  categoryTitle: string;
  items: Item[];
  isLoggedIn?: boolean;
  showYearLink?: boolean;
}

export function CategoryList({
  categoryTitle,
  items,
  isLoggedIn = false,
  showYearLink = false,
}: CategoryListProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-bold -ml-4">{categoryTitle}</h2>
      {items.length > 0 ? (
        <ol className="list-decimal list-outside text-gray-400 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="pl-2">
              <span className="text-gray-700 dark:text-gray-300">
                {item.itemtype === "Book" && `${item.author}, `}
                <span className="text-sky-900 dark:text-sky-200">
                  {item.title}
                </span>
                {item.itemtype === "Movie" &&
                  ` (${item.director || "Unknown Director"}, ${item.published_year})`}
                {item.itemtype === "Show" &&
                  ` (season ${item.season || "Unknown"})`}
              </span>

              {item.redo && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-700">
                  {item.itemtype === "Book" ? "Reread" : "Rewatch"}
                </span>
              )}

              {showYearLink && (
                <div className="flex">
                  <Link
                    href={`/year/${item.belongs_to_year}`}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Added in {item.belongs_to_year}
                  </Link>
                </div>
              )}

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
          No {categoryTitle.toLowerCase()} found.
        </p>
      )}
    </div>
  );
}
