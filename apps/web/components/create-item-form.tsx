"use client";
import { FormEvent } from "react";
import { createClientForBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ItemInsert } from "@/types";

export default function CreateItemForm() {
  const router = useRouter();
  const supabase = createClientForBrowser();
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    itemType: "Book" | "Movie" | "Show",
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newItem: ItemInsert = {
      title: formData.get("title") as string,
      itemtype: itemType,
      belongs_to_year: currentYear,
      published_year: Number(formData.get("publishedYear")),
      redo: formData.get("redo") === "on",
    };

    if (itemType === "Book") {
      newItem.author = formData.get("author") as string;
    } else if (itemType === "Movie") {
      newItem.director = formData.get("director") as string;
    } else if (itemType === "Show") {
      newItem.season = Number(formData.get("season")) || null;
    }

    const { error } = await supabase.from("items").insert(newItem);

    if (error) {
      console.error("Error creating item:", error);
    } else {
      router.push(`/year/${currentYear}`);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">➕ Add New Item</h1>

      <Tabs defaultValue="book" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="book">Book</TabsTrigger>
          <TabsTrigger value="movie">Movie</TabsTrigger>
          <TabsTrigger value="show">TV Show</TabsTrigger>
        </TabsList>

        {/* Book Form */}
        <TabsContent value="book">
          <form onSubmit={(e) => handleSubmit(e, "Book")} className="space-y-4">
            <Label>Title</Label>
            <Input type="text" name="title" required />

            <Label>Author</Label>
            <Input type="text" name="author" required />

            <Label>Published Year</Label>
            <Input type="number" name="publishedYear" required />

            <div className="flex items-center space-x-2">
              <Checkbox id="redo" name="redo" />
              <Label htmlFor="redo">Redo?</Label>
            </div>

            <Button type="submit" className="w-full">
              Save Book
            </Button>
          </form>
        </TabsContent>

        {/* Movie Form */}
        <TabsContent value="movie">
          <form
            onSubmit={(e) => handleSubmit(e, "Movie")}
            className="space-y-4"
          >
            <Label>Title</Label>
            <Input type="text" name="title" required />

            <Label>Director</Label>
            <Input type="text" name="director" required />

            <Label>Release Year</Label>
            <Input type="number" name="publishedYear" required />

            <div className="flex items-center space-x-2">
              <Checkbox id="redo" name="redo" />
              <Label htmlFor="redo">Redo?</Label>
            </div>

            <Button type="submit" className="w-full">
              Save Movie
            </Button>
          </form>
        </TabsContent>

        {/* TV Show Form */}
        <TabsContent value="show">
          <form onSubmit={(e) => handleSubmit(e, "Show")} className="space-y-4">
            <Label>Title</Label>
            <Input type="text" name="title" required />

            <Label>Season</Label>
            <Input type="number" name="season" required />

            <Label>Release Year</Label>
            <Input type="number" name="publishedYear" required />

            <div className="flex items-center space-x-2">
              <Checkbox id="redo" name="redo" />
              <Label htmlFor="redo">Redo?</Label>
            </div>

            <Button type="submit" className="w-full">
              Save Show
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </main>
  );
}
