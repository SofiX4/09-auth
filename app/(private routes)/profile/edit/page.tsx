"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore, selectSetUser } from "@/lib/store/authStore";
import type { UpdateUserPayload } from "@/lib/api/clientApi";
import axios from "axios";
import Image from "next/image";
import css from "./EditProfile.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");
  const setUser = useAuthStore(selectSetUser);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: UpdateUserPayload) => updateMe(updates),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);

      queryClient.setQueryData(["user"], updatedUser);

      queryClient.invalidateQueries({ queryKey: ["user"] });

      router.push("/profile");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to update profile";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updateMutation.isPending) return;

    setError("");

    const formData = new FormData(e.currentTarget);

    const updates: UpdateUserPayload = {
      username: formData.get("username") as string,
    };

    updateMutation.mutate(updates);
  };

  const handleCancel = () => {
    router.push("/profile");
  };

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

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            defaultValue={user.username}
            className={css.input}
            required
            minLength={3}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={user.email}
            className={css.input}
            disabled
            readOnly
          />
          <p className={css.helperText}>Email cannot be changed</p>
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            className={css.cancelButton}
            onClick={handleCancel}
            disabled={updateMutation.isPending}
          >
            Cancel
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
