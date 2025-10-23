import { withDehydratedState } from '@/lib/prefetch'
import { fetchNoteById } from '@/lib/api'
import NoteDetailsClient from './NoteDetails.client'

type ParamsPromise = Promise<{ id: string }>

export default async function NoteDetailsPage({
  params,
}: {
  params: ParamsPromise
}) {
  const { id } = await params

  const element = await withDehydratedState(
    async (qc) => {
      await qc.prefetchQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
      })
    },
    <NoteDetailsClient />
  )

  return element
}