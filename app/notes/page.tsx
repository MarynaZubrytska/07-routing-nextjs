import { withDehydratedState } from "@/lib/prefetch";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

export default async function NotesPage() {
  const element = await withDehydratedState(
    async (qc) => {
      await qc.prefetchQuery({
        queryKey: ["notes", "", 1, PER_PAGE],
        queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: "" }),
      });
    },
    <NotesClient />
  );

  return element;
}
