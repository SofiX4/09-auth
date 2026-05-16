// lib/api/serverApi.ts
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import type { Note, NoteId } from "@/types/note";
import { User } from "@/types/user";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
};

// ========== TYPES ==========

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

// ========== NOTES ==========

export const fetchNotes = async (
  params?: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const cookieHeader = await getCookieHeader();

  const res = await axios.get<FetchNotesResponse>(`${baseURL}/notes`, {
    params: {
      ...params,
      perPage: 12,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const res = await axios.get<Note>(`${baseURL}/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res.data;
};

// ========== AUTH ==========

export const checkSession = async (): Promise<AxiosResponse<User> | null> => {
  const cookieHeader = await getCookieHeader();

  try {
    const response = await axios.get<User>(`${baseURL}/auth/session`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    return response; // ← повертаємо весь response (з headers)
  } catch {
    return null;
  }
};

// ========== USER ==========

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const res = await axios.get<User>(`${baseURL}/users/me`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data;
};
