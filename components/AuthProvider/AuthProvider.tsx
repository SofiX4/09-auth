// components/AuthProvider/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import {
  useAuthStore,
  selectSetUser,
  selectClearUser,
} from "@/lib/store/authStore";

const privateRoutes = ["/profile", "/notes"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useAuthStore(selectSetUser);
  const clearUser = useAuthStore(selectClearUser);

  useEffect(() => {
    const verifySession = async () => {
      const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
      );

      try {
        const user = await checkSession();

        if (user) {
          setUser(user); // ← Оновлюємо Zustand
        } else {
          clearUser(); // ← ВАЖЛИВО: очищаємо при відсутності сесії

          if (isPrivateRoute) {
            router.push("/sign-in");
          }
        }
      } catch {
        clearUser(); // ← ВАЖЛИВО: очищаємо при помилці

        if (isPrivateRoute) {
          router.push("/sign-in");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [pathname, router, setUser, clearUser]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontSize: "1.5rem",
          color: "#6b7280",
        }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
