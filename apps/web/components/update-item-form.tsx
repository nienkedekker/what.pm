"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClientForBrowser } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Item, ItemUpdate } from "@/types";

interface UpdateItemFormProps {
  item: Item;
}

export default function UpdateItemForm({ item }: UpdateItemFormProps) {
  const router = useRouter();
  const supabase = createClientForBrowser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Construct updated item object
    const updatedItem: ItemUpdate = {
      title: formData.get("title") as string,
      published_year: Number(formData.get("publishedYear")),
      redo: formData.get("redo") === "on",
    };

    if (item.itemtype === "Book") {
      updatedItem.author = formData.get("author") as string;
    } else if (item.itemtype === "Movie") {
      updatedItem.director = formData.get("director") as string;
    } else if (item.itemtype === "Show") {
      updatedItem.season = Number(formData.get("season")) || null;
    }

    const { error } = await supabase
      .from("items")
      .update(updatedItem)
      .eq("id", item.id);

    if (error) {
      console.error("Error updating item:", error);
    } else {
      router.push(`/year/${item.belongs_to_year}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label>Title</Label>
      <Input type="text" name="title" defaultValue={item.title} required />

      {item.itemtype === "Book" && (
        <>
          <Label>Author</Label>
          <Input
            type="text"
            name="author"
            defaultValue={item.author ?? ""}
            required
          />
        </>
      )}

      {item.itemtype === "Movie" && (
        <>
          <Label>Director</Label>
          <Input
            type="text"
            name="director"
            defaultValue={item.director ?? ""}
            required
          />
        </>
      )}

      {item.itemtype === "Show" && (
        <>
          <Label>Season</Label>
          <Input
            type="number"
            name="season"
            defaultValue={item.season ?? ""}
            required
          />
        </>
      )}

      <Label>Published Year</Label>
      <Input
        type="number"
        name="publishedYear"
        defaultValue={item.published_year}
        required
      />

      <div className="flex items-center space-x-2">
        <Checkbox id="redo" name="redo" defaultChecked={item.redo ?? false} />
        <Label htmlFor="redo">Redo?</Label>
      </div>

      <Button type="submit" className="w-full">
        Update Item
      </Button>
    </form>
  );
}
