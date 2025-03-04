import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import YearNavigation from "@/components/lists/year-navigation";
import { Gamja_Flower } from "next/font/google";

const gamja = Gamja_Flower({
  weight: "400",
  subsets: ["latin"],
});

export default function Navigation() {
  return (
    <nav className="border-b border-b-foreground/10 flex flex-col gap-0">
      <h1 className="text-4xl text-white md:text-5xl lg:text-6xl bg-slate-950 dark:bg-zinc-900 p-4">
        <Link href="/">
          <span className={`${gamja.className}`}>what.</span>
        </Link>
      </h1>
      <div className="flex items-center justify-between text-sm pl-1 bg-sky-200 dark:bg-zinc-800 border-b border-b-foreground/10">
        <div>
          <Button asChild variant="link">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="link">
            <Link href="/about">About</Link>
          </Button>
          <Button asChild variant="link">
            <Link href="/stats">Stats</Link>
          </Button>
        </div>
        <div className="flex items-center">
          <AuthButton />
          <ThemeSwitcher />
        </div>
      </div>
      <YearNavigation />
    </nav>
  );
}
