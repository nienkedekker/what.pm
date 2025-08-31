import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Exact path matches
const protectedPaths = ["/create", "/protected"];

// Add pattern-based protection (e.g., /item/<anything>)
function isProtectedPathname(pathname: string) {
  if (protectedPaths.includes(pathname)) return true;
  if (pathname.startsWith("/item/")) return true; // 👈 NEW: protect all /item/*
  return false;
}

export async function updateSession(request: NextRequest) {
  // Keep a response object we can mutate cookies onto
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Reflect cookie updates into both request and outgoing response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not add logic between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Allow auth routes through without gating
  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-in"); // 👈 allow your sign-in page

  // Gate only the paths we care about
  if (!user && !isAuthRoute && isProtectedPathname(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    // Preserve where they were going (path + query)
    url.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);
  }

  // IMPORTANT: return the same response object that carries Supabase cookies
  return supabaseResponse;
}
