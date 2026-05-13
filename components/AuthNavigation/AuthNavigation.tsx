"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/api/clientApi";
import {
  useAuthStore,
  selectIsAuthenticated,
  selectUserEmail,
  selectClearUser,
} from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";

export function AuthNavigation() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userEmail = useAuthStore(selectUserEmail);
  const clearUser = useAuthStore(selectClearUser);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUser();
      router.push("/sign-in");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{userEmail || "User email"}</p>
            <button
              className={css.logoutButton}
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
