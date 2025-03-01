import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateItemForm from "@/components/create-item-form";

export default async function ProtectedPage() {
  const supabase = await createClientForServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <CreateItemForm />;
}
