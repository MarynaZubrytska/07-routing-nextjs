import { withDehydratedState } from "@/lib/prefetch";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const raw = slug?.[0];
  const tag = !raw || raw === "all" ? "" : raw;

  const element = await withDehydratedState(
    async (qc) => {
      await qc.prefetchQuery({
        queryKey: ["notes", tag, 1, PER_PAGE, ""],
        queryFn: () =>
          fetchNotes({
            page: 1,
            perPage: PER_PAGE,
            search: "",
            tag: tag ? tag : undefined,
          }),
      });
    },
    <NotesClient initialTag={tag} />
  );

  return element;
}
