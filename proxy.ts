// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken) {
    if (refreshToken) {
      // Якщо accessToken відсутній, але є refreshToken — перевіряємо сесію
      const response = await checkSession(); // ← тепер повертає AxiosResponse

      if (response) {
        const setCookie = response.headers["set-cookie"]; // ← тепер працює!

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed["Max-Age"]),
            };

            if (parsed.accessToken)
              cookieStore.set("accessToken", parsed.accessToken, options);
            if (parsed.refreshToken)
              cookieStore.set("refreshToken", parsed.refreshToken, options);
          }

          // Якщо сесія активна:
          // публічний маршрут → редірект на профіль
          if (isPublicRoute) {
            return NextResponse.redirect(new URL("/profile", request.url), {
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }

          // приватний маршрут → дозволяємо доступ
          if (isPrivateRoute) {
            return NextResponse.next({
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }
        }
      }
    }

    // Якщо refreshToken або сесії немає:
    // публічний маршрут → дозволяємо доступ
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // приватний маршрут → редірект на логін
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Якщо accessToken існує:
  // публічний маршрут → редірект на профіль
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // приватний маршрут → дозволяємо доступ
  if (isPrivateRoute) {
    return NextResponse.next();
  }

  // Інші маршрути → дозволяємо доступ
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
