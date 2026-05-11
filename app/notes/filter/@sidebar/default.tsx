import Link from "next/link";
import { TAGS } from "../constants";
import css from "@/styles/SidebarNotes.module.css";

export default function SidebarDefault() {
  return (
    <nav>
      <ul className={css.menuList}>
        {TAGS.map((item) => (
          <li key={item.id} className={css.menuItem}>
            <Link href={`/notes/filter/${item.id}`} className={css.menuLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
