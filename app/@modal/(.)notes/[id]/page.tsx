import { withDehydratedState } from "@/lib/prefetch";
import { fetchNoteById } from "@/lib/api";
import NotePreview from "./NotePreview.client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedNoteModal({ params }: PageProps) {
  const { id } = await params;

  const element = await withDehydratedState(
    async (qc) => {
      await qc.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
      });
    },
    <NotePreview id={id} />
  );

  return element;
}
