import { request } from "./client";
import type { ExerciseSet } from "../types";

export type ExerciseSetPayload = {
  title: string;
  description?: string;
  nativeLanguage: string;
  targetLanguage: string;
  level?: string;
  category?: string;
};

export function getExerciseSets(): Promise<ExerciseSet[]> {
  return request<ExerciseSet[]>("/api/exercise-sets");
}

export function getExerciseSet(id: number): Promise<ExerciseSet> {
  return request<ExerciseSet>(`/api/exercise-sets/${id}`);
}

export function createExerciseSet(payload: ExerciseSetPayload): Promise<ExerciseSet> {
  return request<ExerciseSet>("/api/exercise-sets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateExerciseSet(id: number, payload: Partial<ExerciseSetPayload>): Promise<ExerciseSet> {
  return request<ExerciseSet>(`/api/exercise-sets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteExerciseSet(id: number): Promise<void> {
  return request<void>(`/api/exercise-sets/${id}`, {
    method: "DELETE",
  });
}
