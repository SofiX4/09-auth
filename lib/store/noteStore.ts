import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { NoteTag } from "@/types/note";

export interface NoteDraft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteStore {
  draft: NoteDraft;
  setDraft: (draft: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist(
    immer((set) => ({
      draft: initialDraft,

      setDraft: (updates) =>
        set((state) => {
          Object.assign(state.draft, updates);
        }),

      clearDraft: () =>
        set((state) => {
          state.draft = initialDraft;
        }),
    })),
    {
      name: "note-draft-storage",
    }
  )
);

// ========== СЕЛЕКТОРИ ==========

// Витягти весь draft
export const selectDraft = (state: NoteStore) => state.draft;

// Витягти тільки title
export const selectDraftTitle = (state: NoteStore) => state.draft.title;

// Витягти тільки content
export const selectDraftContent = (state: NoteStore) => state.draft.content;

// Витягти тільки tag
export const selectDraftTag = (state: NoteStore) => state.draft.tag;

// Витягти тільки setDraft
export const selectSetDraft = (state: NoteStore) => state.setDraft;

// Витягти тільки clearDraft
export const selectClearDraft = (state: NoteStore) => state.clearDraft;

// Перевірити, чи draft порожній
export const selectIsDraftEmpty = (state: NoteStore) =>
  state.draft.title === "" && state.draft.content === "";
