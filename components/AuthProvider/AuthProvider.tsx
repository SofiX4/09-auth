"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
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

  // Зберігаємо останній перевірений шлях
  const lastVerifiedPath = useRef<string | null>(null); // ← ВИПРАВЛЕНО: string | null

  useEffect(() => {
    // Якщо вже перевірили цей шлях - не робимо повторно
    if (lastVerifiedPath.current === pathname) {
      // ← ВИПРАВЛЕНО
      return;
    }

    const verifySession = async () => {
      const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
      );

      try {
        // Крок 1: Перевірити чи сесія дійсна
        const isSessionValid = await checkSession();

        if (isSessionValid) {
          // Крок 2: Отримати дані користувача ОКРЕМО
          const user = await getMe();
          setUser(user);
        } else {
          // Сесія недійсна - очищаємо Zustand
          clearUser();

          // Якщо користувач на приватному маршруті - редірект на логін
          if (isPrivateRoute) {
            router.push("/sign-in");
          }
        }
      } catch {
        // Помилка при отриманні даних - очищаємо Zustand
        clearUser();

        // Якщо користувач на приватному маршруті - редірект на логін
        if (isPrivateRoute) {
          router.push("/sign-in");
        }
      } finally {
        // Завжди прибираємо loading стан
        setIsLoading(false);
        lastVerifiedPath.current = pathname; // ← ВИПРАВЛЕНО: зберігаємо шлях
      }
    };

    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
