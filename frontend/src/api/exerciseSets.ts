import { request } from "./client";
import type { ExerciseSet } from "../types";

export function getExerciseSets(): Promise<ExerciseSet[]> {
  return request<ExerciseSet[]>("/api/exercise-sets");
}

export function getExerciseSet(id: number): Promise<ExerciseSet> {
  return request<ExerciseSet>(`/api/exercise-sets/${id}`);
}
