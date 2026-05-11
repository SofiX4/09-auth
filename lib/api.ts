import axios from "axios";
import type { Note, NoteId } from "@/types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async (
  params?: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: NoteId): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};
