"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { register, type RegisterRequest } from "@/lib/api/clientApi";
import { useAuthStore, selectSetUser } from "@/lib/store/authStore";
import axios from "axios";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const setUser = useAuthStore(selectSetUser);

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      setUser(user);
      router.push("/profile");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setError("This email is already registered");
        } else {
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "Registration failed";
          setError(errorMessage);
        }
      } else {
        setError("An unexpected error occurred");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerMutation.isPending) return;

    setError("");

    const formData = new FormData(e.currentTarget);
    const credentials: RegisterRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    registerMutation.mutate(credentials);
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign up</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            minLength={6}
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
