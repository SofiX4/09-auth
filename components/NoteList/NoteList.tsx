import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
  onDeleted?: () => void;
}

export default function NoteList({ notes, onDeleted }: NoteListProps) {
  const qc = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      onDeleted?.();
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <Link href={`/notes/${id}`}>View details</Link>
            <button className={css.button} onClick={() => mutate(id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
