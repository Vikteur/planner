import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { TeamSlotInput, WeddingInput } from '../api/client'

/**
 * Server state, through react-query.
 *
 * Everything the planner shows belongs to the server — weddings, vendors, the
 * team, how far along the couple's lists are. The only genuine client state on
 * these screens is whether a form is currently submitting, which is why there
 * is no store here beyond the cache.
 *
 * Query keys are arrays so a wedding's caches can be invalidated together after
 * a write: assigning a DJ changes the wedding, its team and the overview row
 * that shows the confirmation pills.
 */
export const keys = {
  weddings: (params?: { status?: string; q?: string }) => ['weddings', params ?? {}] as const,
  wedding: (id: string) => ['wedding', id] as const,
  timeline: (id: string) => ['wedding', id, 'timeline'] as const,
  tasks: (id: string) => ['wedding', id, 'tasks'] as const,
  songLists: (id: string) => ['wedding', id, 'song-lists'] as const,
  portal: (id: string) => ['wedding', id, 'portal'] as const,
  vendors: (category?: string) => ['vendors', category ?? 'all'] as const,
}

export function useWeddings(params?: { status?: 'upcoming' | 'past' | 'all'; q?: string }) {
  return useQuery({
    queryKey: keys.weddings(params),
    queryFn: () => api.weddings(params),
  })
}

export function useWedding(id: string | undefined) {
  return useQuery({
    queryKey: keys.wedding(id ?? ''),
    queryFn: () => api.wedding(id!),
    enabled: Boolean(id),
  })
}

export function useTimeline(id: string | undefined) {
  return useQuery({
    queryKey: keys.timeline(id ?? ''),
    queryFn: () => api.timeline(id!),
    enabled: Boolean(id),
  })
}

export function useVendors(category?: string) {
  return useQuery({
    queryKey: keys.vendors(category),
    queryFn: () => api.vendors(category),
    // The directory changes rarely and is read on every screen that assigns a
    // vendor; refetching it per navigation is pure noise.
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateWedding() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: WeddingInput) => api.createWedding(input),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['weddings'] })
    },
  })
}

export function useUpdateWedding(id: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<WeddingInput>) => api.updateWedding(id, input),
    onSuccess: (updated) => {
      client.setQueryData(keys.wedding(id), updated)
      void client.invalidateQueries({ queryKey: ['weddings'] })
    },
  })
}

export function useAssignRole(weddingId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ role, input }: { role: string; input: TeamSlotInput }) =>
      api.assignRole(weddingId, role, input),
    onSuccess: () => {
      // The wedding for the detail screen, and the list for the pills on the
      // overview row — both are now wrong.
      void client.invalidateQueries({ queryKey: keys.wedding(weddingId) })
      void client.invalidateQueries({ queryKey: ['weddings'] })
    },
  })
}
