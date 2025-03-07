"use client";

import { searchItems } from "@/app/actions";
import { CategoryList } from "@/components/lists/category-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "@/types";
import { useActionState } from "react";

const categories = [
  { title: "Books", type: "Book" },
  { title: "Movies", type: "Movie" },
  { title: "TV Shows", type: "Show" },
];

export default function SearchForm() {
  const [state, formAction] = useActionState(searchItems, {
    query: "",
    results: [],
    initial: true,
  });

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="mb-6 flex gap-2">
        <Input
          type="text"
          name="query"
          placeholder="Search items..."
          defaultValue={state.query}
          className="border p-2 rounded-md w-96"
        />
        <Button type="submit">Search</Button>
      </form>

      {!state.initial && state.results.length === 0 && (
        <p className="mt-3 text-gray-600">No results found.</p>
      )}

      {state.results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-32 px-6">
          {categories.map(({ title, type }) => {
            const categoryItems = state.results.filter(
              (item: Item) => item.itemtype === type,
            );
            return categoryItems.length > 0 ? (
              <CategoryList
                key={type}
                categoryTitle={title}
                items={categoryItems}
                showYearLink={true}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
