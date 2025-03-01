import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import AuthButton from "@/components/header-auth";
import YearNavigation from "@/components/year-navigation";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Link from "next/link";

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
            <nav className="border-b border-b-foreground/10 flex flex-col gap-4">
              <h1 className="mb-4 text-4xl leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                <span className="px-4 text-white bg-blue-600 rounded-br-xl font-bold  ">
                  what
                </span>
              </h1>
              <div className="flex gap-4 items-center">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/stats">Stats</Link>
                <AuthButton />
              </div>
              <YearNavigation />
            </nav>
            <main className="flex-grow">{children}</main>
            <footer className="border-t">
              footer
              <ThemeSwitcher />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
