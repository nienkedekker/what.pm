import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClientForServer } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClientForServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <>
      <Button asChild variant="link">
        <Link href="/create">Create</Link>
      </Button>
      <form action={signOutAction} className="inline">
        <Button type="submit" variant="link">
          Sign out
        </Button>
      </form>
    </>
  ) : (
    <>
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </>
  );
}
