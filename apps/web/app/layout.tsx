import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import AuthButton from "@/components/header-auth";
import YearNavigation from "@/components/lists/year-navigation";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "what.",
  description: "what!!!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="bg-background text-foreground text-sm/7">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col justify-between">
            <nav className="border-b border-b-foreground/10 flex flex-col gap-0">
              <h1 className="text-4xl leading-none tracking-tighter text-gray-900 md:text-5xl lg:text-6xl bg-black">
                <Link href="/">
                  <span className="pl-4 text-white font-bold">what.</span>
                </Link>
              </h1>
              <div className="flex items-center justify-between text-sm pl-1 bg-sky-200 border-b border-b-foreground/10">
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
                <div>
                  <AuthButton />
                </div>
              </div>
              <YearNavigation />
            </nav>
            <main className="flex-grow mx-auto container py-6 lg:py-16 px-12 lg:px-0">
              {children}
            </main>
            <footer className="border-t">
              <ThemeSwitcher />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
