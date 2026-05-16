import { request } from "./client";
import type { Exercise, ExerciseSet } from "../types";

export function getExercises(): Promise<Exercise[]> {
  return request<Exercise[]>("/api/exercises");
}

export function getExercise(id: number): Promise<Exercise> {
  return request<Exercise>(`/api/exercises/${id}`);
}

export function getExerciseSet(id: number): Promise<ExerciseSet> {
  return request<ExerciseSet>(`/api/exercise-sets/${id}`);
}
