import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMe } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "View and manage your profile",
};

export default async function ProfilePage() {
  let user;

  try {
    user = await getMe();
  } catch {
    redirect("/sign-in");
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
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>
            <strong>Username:</strong> {user.username || "your_username"}
          </p>
          <p>
            <strong>Email:</strong> {user.email || "your_email@example.com"}
          </p>
        </div>
      </div>
    </main>
  );
}
