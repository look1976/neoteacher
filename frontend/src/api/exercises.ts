import { request } from "./client";
import type { Exercise, ExerciseSet, AnswerOption } from "../types";

export type AnswerOptionPayload = {
  text: string;
  isCorrect: boolean;
  imagePath?: string | null;
  audioPath?: string | null;
  sortOrder: number;
};

export type ExercisePayload = {
  exerciseSetId: number;
  type: string;
  questionText: string;
  promptText?: string;
  correctAnswers: string[];
  acceptableAnswers?: string[];
  explanation?: string;
  difficulty?: string;
  tags?: string[];
  answerOptions?: AnswerOptionPayload[];
};

export function getExercises(): Promise<Exercise[]> {
  return request<Exercise[]>("/api/exercises");
}

export function getExercise(id: number): Promise<Exercise> {
  return request<Exercise>(`/api/exercises/${id}`);
}

export function getExerciseSet(id: number): Promise<ExerciseSet> {
  return request<ExerciseSet>(`/api/exercise-sets/${id}`);
}

export function createExercise(payload: ExercisePayload): Promise<Exercise> {
  return request<Exercise>("/api/exercises", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateExercise(id: number, payload: Partial<ExercisePayload>): Promise<Exercise> {
  return request<Exercise>(`/api/exercises/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteExercise(id: number): Promise<void> {
  return request<void>(`/api/exercises/${id}`, {
    method: "DELETE",
  });
}

export function checkDraftAnswer(payload: {
  userAnswer: string;
  correctAnswers: string[];
  acceptableAnswers?: string[];
}): Promise<unknown> {
  return request<unknown>("/api/exercises/check", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
