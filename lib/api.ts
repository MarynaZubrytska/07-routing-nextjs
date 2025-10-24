import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

export const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
if (TOKEN && TOKEN.trim()) {
  api.defaults.headers.common.Authorization = `Bearer ${TOKEN}`;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

interface NotesApiResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesResponse {
  items: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { page, perPage, search, tag } = params;
  const query: Record<string, string | number> = { page, perPage };
  if (search) query.search = search;
  if (tag) query.tag = tag;

  const { data } = await api.get<NotesApiResponse>("/notes", { params: query });
  const items = data?.notes ?? [];
  return {
    items,
    totalPages: data?.totalPages ?? 0,
    page,
    perPage,
  };
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
