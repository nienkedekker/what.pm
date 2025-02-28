"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateItem() {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [itemtype, setItemType] = useState("Book");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const { error } = await supabase
      .from("items")
      .insert([{ title, itemtype, belongs_to_year: currentYear }]);

    if (error) console.error("Error creating item:", error);
    else router.push("/");
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">➕ Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="border p-2 w-full"
          value={itemtype}
          onChange={(e) => setItemType(e.target.value)}
        >
          <option value="Book">📖 Book</option>
          <option value="Movie">🎬 Movie</option>
          <option value="Show">📺 Show</option>
        </select>
        <button type="submit" className="bg-green-500 text-white p-2">
          Save
        </button>
      </form>
    </main>
  );
}
