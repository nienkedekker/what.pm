import { createClientForServer } from "@/utils/supabase/server";
import Link from "next/link";

export default async function YearNavigation() {
  const supabase = await createClientForServer();
  const { data, error } = await supabase
    .from("distinct_years")
    .select("*")
    .order("belongs_to_year", { ascending: true });

  if (error) {
    console.error("Error fetching years:", error);
    console.error("Supabase Error:", error.code, error.message, error.details);

    return <p>Failed to load years.</p>;
  }

  return (
    <div className="bg-accent text-sm p-3 px-5 text-foreground flex gap-3 items-center">
      <ul className="flex gap-4">
        {data?.map(({ belongs_to_year }) => (
          <li key={belongs_to_year}>
            <Link href={`/year/${belongs_to_year}`} className="text-blue-500">
              {belongs_to_year}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
