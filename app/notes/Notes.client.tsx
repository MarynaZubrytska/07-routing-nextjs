"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import EmptyState from "@/components/EmptyState/EmptyState";

import css from "./Notes.client.module.css";

const PER_PAGE = 12;

export default function NotesClient() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedQuery] = useDebounce(query.trim(), 400);
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["notes", debouncedQuery, page, PER_PAGE],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedQuery }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={setQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          type="button"
          className={css.button}
          aria-haspopup="dialog"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <section className={css.contentArea}>
        <div className={css.statusRow}>
          <div style={{ visibility: isFetching ? "visible" : "hidden" }}>
            <Loader label="Loading…" />
          </div>
        </div>

        {isError && <ErrorMessage message="Failed to load notes" />}
        {!isFetching && isSuccess && notes.length === 0 && <EmptyState />}
        {notes.length > 0 && <NoteList notes={notes} />}
      </section>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
