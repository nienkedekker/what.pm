import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ItemsList({ year }: { year: number }) {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("belongs_to_year", year)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
    return <p>Failed to load data.</p>;
  }

  // Group items by type
  const books = items.filter((item) => item.itemtype === "Book");
  const movies = items.filter((item) => item.itemtype === "Movie");
  const shows = items.filter((item) => item.itemtype === "Show");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-36 p-4">
      {/* Books Column */}
      <div className="flex flex-col gap-6">
        <h2 className="font-bold -ml-4">Books</h2>
        {books.length > 0 ? (
          <ol className="list-decimal list-outside text-gray-400 space-y-4">
            {books.map((book) => (
              <li key={book.id} className="pl-4">
                <span className="text-gray-900">
                  {book.author},{" "}
                  <span className="text-sky-900">{book.title}</span>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">No books logged this year.</p>
        )}
      </div>

      {/* Movies Column */}
      <div className="flex flex-col gap-6">
        <h2 className="font-bold -ml-4">Movies</h2>
        {movies.length > 0 ? (
          <ol className="list-decimal list-outside text-gray-400 space-y-4">
            {movies.map((movie) => (
              <li key={movie.id} className="pl-4">
                <span className="text-gray-900">
                  <span className="text-sky-900">{movie.title}</span> (
                  {movie.director || "Unknown Director"}, {movie.published_year}
                  )
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 italic">No movies logged this year.</p>
        )}
      </div>

      {/* Shows Column */}
      <div className="flex flex-col gap-6">
        <h2 className="font-bold -ml-4">TV Shows</h2>
        {shows.length > 0 ? (
          <ol className="list-decimal list-outside text-gray-400 space-y-4">
            {shows.map((show) => (
              <li key={show.id} className="pl-4">
                <span className="text-gray-900">
                  <span className="text-sky-900">{show.title}</span> (season{" "}
                  {show.season || "Unknown"})
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 italic">No TV shows logged this year.</p>
        )}
      </div>
    </div>
  );
}
