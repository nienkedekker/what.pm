import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const hiddenPages = ["/create", "/protected"];

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // protected routes
  if (!user) {
    // Allow access to shared maps, auth, T&C
    if (hiddenPages.some((hiddenPage) => path.startsWith(hiddenPage))) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return response;
  }

  return response;
};

export const config = {
  matcher: ["/create", "/protected"],
};
