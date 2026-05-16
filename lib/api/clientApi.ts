import { apiClient } from "./api";
import type { Note, NoteId } from "@/types/note";
import type { User } from "@/types/user";
import axios from "axios";

// ========== TYPES ==========

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

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

export interface UpdateUserPayload {
  username: string;
}

// ========== NOTES ==========

export const fetchNotes = async (
  params?: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const response = await apiClient.get<FetchNotesResponse>("/notes", {
    params: {
      page: params?.page || 1,
      perPage: params?.perPage || 12,
      ...(params?.tag && { tag: params.tag }),
      ...(params?.search && { search: params.search }),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
  const res = await apiClient.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  const res = await apiClient.post<Note>("/notes", noteData);
  return res.data;
};

export const deleteNote = async (id: NoteId): Promise<Note> => {
  const res = await apiClient.delete<Note>(`/notes/${id}`);
  return res.data;
};

// ========== AUTH ==========

export const register = async (credentials: RegisterRequest): Promise<User> => {
  const res = await apiClient.post<User>("/auth/register", credentials);
  return res.data;
};

export const login = async (credentials: LoginRequest): Promise<User> => {
  const res = await apiClient.post<User>("/auth/login", credentials);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  try {
    await apiClient.get("/auth/session");
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return false;
    }

    throw error;
  }
};

// ========== USER ==========

export const getMe = async (): Promise<User> => {
  const res = await apiClient.get<User>("/users/me");
  return res.data;
};

export const updateMe = async (updates: UpdateUserPayload): Promise<User> => {
  const res = await apiClient.patch<User>("/users/me", updates);
  return res.data;
};
