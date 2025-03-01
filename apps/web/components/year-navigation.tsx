import { createClientForServer } from "@/utils/supabase/server";
import Link from "next/link";
import { Database } from "../types";

export default async function YearNavigation() {
  const supabase = await createClientForServer();
  const { data, error } = await supabase
    .from("distinct_years")
    .select("*")
    .order("belongs_to_year", { ascending: true });

  if (error) {
    console.error("Error fetching years:", error);
    return <p>Failed to load years.</p>;
  }

  return (
    <div className="">
      <ul className="flex gap-4">
        <li>
          <Link href="/">🏠 Home</Link>
        </li>
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
