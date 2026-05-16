import { request } from "./client";
import type { GrammarNote } from "../types";

export function getGrammarNoteById(noteId: number) {
  return request<GrammarNote>(`/api/grammar-notes/${noteId}`);
}
