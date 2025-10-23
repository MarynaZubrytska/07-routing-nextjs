"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api";
import Link from "next/link";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  if (!notes.length) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>

            <Link className={css.link} href={`/notes/${id}`}>
              View details
            </Link>

            <button
              type="button"
              className={css.button}
              onClick={() => mutate(id)}
              disabled={isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
