import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { makeQueryClient } from './queryClient'

export async function withDehydratedState(
  prefetch: (qc: ReturnType<typeof makeQueryClient>) => Promise<void>,
  children: ReactNode
) {
  const queryClient = makeQueryClient()
  await prefetch(queryClient)
  const state = dehydrate(queryClient)
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>
}
