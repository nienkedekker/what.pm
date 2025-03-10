import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateItemForm from "@/components/forms/create-item-form";

export default async function CreatePage() {
  const supabase = await createClientForServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <CreateItemForm />;
}
