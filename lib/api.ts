import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const api = axios.create({
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
}

interface NotesApiResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesResponse {
  items: Note[];
  totalPages: number;
  page?: number;
  perPage?: number;
  total?: number;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params = { page, perPage, ...(search ? { search } : {}) };

  const { data } = await api.get<NotesApiResponse>("/notes", { params });

  return {
    items: data.notes ?? [],
    totalPages: data.totalPages ?? 0,
    page,
    perPage,
  };
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}
