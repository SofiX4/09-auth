// app/(private routes)/profile/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/clientApi";
import css from "./EditProfilePage.module.css";

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
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
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username || "your_username"}</p>
          <p>Email: {user.email || "your_email@example.com"}</p>
        </div>
      </div>
    </main>
  );
}
