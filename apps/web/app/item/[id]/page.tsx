import { createClientForServer } from "@/utils/supabase/server";
import UpdateItemForm from "@/components/update-item-form";
import { notFound } from "next/navigation";

export default async function UpdateItemPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClientForServer();
  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!item || error) {
    return notFound();
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Item</h1>
      <UpdateItemForm item={item} />
    </main>
  );
}
