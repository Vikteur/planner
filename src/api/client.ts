import type { components } from './schema'

type S = components['schemas']

export type Me = S['Me']
export type MeResponse = S['MeResponse']
export type WeddingSummary = S['WeddingSummary']
export type Wedding = S['Wedding']
export type WeddingInput = S['WeddingInput']
export type WeddingList = S['WeddingList']
export type Vendor = S['Vendor']
export type VendorList = S['VendorList']
export type VendorCategory = S['VendorCategory']
export type TeamSlot = S['TeamSlot']
export type TeamSlotInput = S['TeamSlotInput']
export type TimelineItem = S['TimelineItem']
export type TimelineList = S['TimelineList']
export type Task = S['Task']
export type TaskList = S['TaskList']
export type PortalLinks = S['PortalLinks']
export type SongListSummary = S['SongListSummary']
export type Role = S['Role']

/**
 * Same origin, always.
 *
 * No `VITE_API_BASE` here, unlike the DJ app, which has to be pointable at
 * another host because a DJ runs it against a service on their own machine.
 * The planner is served by the same nginx that proxies `/api`, in dev by
 * vite's proxy — so the browser sees one origin, the session cookie is
 * first-party in both, and CORS never enters the picture.
 */
const API_BASE = ''

/** The error envelope every endpoint uses: `{"detail": {"code", "message"}}`. */
export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/**
 * Fired when any call answers 401: the session is gone — expired, signed out in
 * another tab, or the account was disabled — and the app should return to the
 * sign-in screen rather than leave someone clicking dead buttons.
 *
 * Sign-in's own 401 is a wrong password, which is a form error, not a lost
 * session; those paths are excluded below.
 */
export const SIGNED_OUT_EVENT = 'rm:signed-out'

async function fail(response: Response, path: string): Promise<never> {
  let code = 'UNKNOWN'
  let message = `Request failed (${response.status})`
  try {
    const detail = (await response.json()).detail
    if (detail?.code) code = detail.code
    if (detail?.message) message = detail.message
  } catch {
    // A non-JSON body (a proxy error page, say). Keep the generic message.
  }
  if (response.status === 401 && !path.startsWith('/api/auth')) {
    window.dispatchEvent(new Event(SIGNED_OUT_EVENT))
  }
  throw new ApiError(response.status, code, message)
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    // The session is an httpOnly cookie, so it has to be sent explicitly.
    credentials: 'same-origin',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  })
  if (!response.ok) return fail(response, path)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

const body = (value: unknown) => JSON.stringify(value)

export const api = {
  // --- who is signed in -----------------------------------------------------

  /** `/api/me`, not `/api/auth/me` — the account is a resource, not an auth step. */
  me: () => request<MeResponse>('/api/me'),
  login: (email: string, password: string) =>
    request<MeResponse>('/api/auth/login', { method: 'POST', body: body({ email, password }) }),
  logout: () => request<{ signed_out: boolean }>('/api/auth/logout', { method: 'POST' }),

  // --- weddings -------------------------------------------------------------

  weddings: (params?: { status?: 'upcoming' | 'past' | 'all'; q?: string }) => {
    const query = new URLSearchParams()
    if (params?.status) query.set('status', params.status)
    if (params?.q) query.set('q', params.q)
    const suffix = query.toString()
    return request<WeddingList>(`/api/weddings${suffix ? `?${suffix}` : ''}`)
  },
  wedding: (id: string) => request<Wedding>(`/api/weddings/${id}`),
  createWedding: (input: WeddingInput) =>
    request<Wedding>('/api/weddings', { method: 'POST', body: body(input) }),
  updateWedding: (id: string, input: Partial<WeddingInput>) =>
    request<Wedding>(`/api/weddings/${id}`, { method: 'PATCH', body: body(input) }),

  // --- the team on the day --------------------------------------------------

  assignRole: (weddingId: string, role: string, input: TeamSlotInput) =>
    request<{ team: TeamSlot[] }>(`/api/weddings/${weddingId}/team/${role}`, {
      method: 'PUT',
      body: body(input),
    }),

  // --- the rest of the planner ---------------------------------------------

  vendors: (category?: string) =>
    request<VendorList>(`/api/vendors${category ? `?category=${category}` : ''}`),
  timeline: (weddingId: string) =>
    request<TimelineList>(`/api/weddings/${weddingId}/timeline`),
  /** Tasks are a top-level collection filtered by wedding, not a sub-resource. */
  tasks: (weddingId: string) => request<TaskList>(`/api/tasks?weddingId=${weddingId}`),
  songLists: (weddingId: string) =>
    request<{ song_lists: SongListSummary[]; progress: { lists_in: number; lists_total: number } }>(
      `/api/weddings/${weddingId}/song-lists`,
    ),
  portal: (weddingId: string) => request<PortalLinks>(`/api/weddings/${weddingId}/portal`),
}
