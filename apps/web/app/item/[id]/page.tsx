import { createClientForServer } from "@/utils/supabase/server";
import UpdateItemForm from "@/components/forms/update-item-form";
import { notFound } from "next/navigation";
import { Params } from "@/types";

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  const supabase = await createClientForServer();
  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
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
