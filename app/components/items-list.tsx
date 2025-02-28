import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ItemsList({ year }: { year: number }) {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("belongs_to_year", year)
    .order("updated_date", { ascending: false });

  if (error) {
    console.error("Error fetching items:", error);
    return <p>Failed to load data.</p>;
  }

  // Group items by type
  const books = items.filter((item) => item.itemtype === "Book");
  const movies = items.filter((item) => item.itemtype === "Movie");
  const shows = items.filter((item) => item.itemtype === "Show");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Books Column */}
      <div>
        <h2 className="text-xl font-bold">Books</h2>
        <ol className="list-decimal list-outside text-gray-400 space-y-3">
          {books.map((book) => (
            <li key={book.id} className="">
              <span className="text-gray-900">
                {book.author ? `${book.author}, ` : ""}
                {book.title}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Movies Column */}
      <div>
        <h2 className="text-xl font-bold mb-2">🎬 Movies</h2>
        <ol>
          {movies.map((movie) => (
            <li key={movie.id} className="p-2 border-b">
              {movie.title}{" "}
              {movie.director || movie.published_year
                ? `(${movie.director ? movie.director : "Unknown Director"}, ${
                    movie.published_year
                  })`
                : ""}
            </li>
          ))}
        </ol>
      </div>

      {/* Shows Column */}
      <div>
        <h2 className="text-xl font-bold mb-2">📺 TV Shows</h2>
        <ol>
          {shows.map((show) => (
            <li key={show.id} className="p-2 border-b">
              {show.title} {show.season ? `(Season ${show.season})` : ""}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
