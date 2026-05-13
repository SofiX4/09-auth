import Link from "next/link";
import { TAGS } from "../../constants";
import css from "./SidebarNotes.module.css";

interface SidebarNotesProps {
  params: Promise<{
    tag?: string[];
  }>;
}

export default async function SidebarNotes({ params }: SidebarNotesProps) {
  const { tag } = await params;
  const currentTag = tag?.[0] || "all";

  return (
    <nav>
      <ul className={css.menuList}>
        {TAGS.map((item) => {
          const isActive = currentTag === item.id;

          return (
            <li key={item.id} className={css.menuItem}>
              <Link
                href={`/notes/filter/${item.id}`}
                className={`${css.menuLink} ${isActive ? css.active : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
