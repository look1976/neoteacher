import { request } from "./client";
import type { UserExerciseProgress, UserProfile } from "../types";

export function getProfiles(): Promise<UserProfile[]> {
  return request<UserProfile[]>("/api/profiles");
}

export function getProfile(id: number): Promise<UserProfile> {
  return request<UserProfile>(`/api/profiles/${id}`);
}

export function getProfileProgress(id: number): Promise<UserExerciseProgress[]> {
  return request<UserExerciseProgress[]>(`/api/profiles/${id}/progress`);
}

export function getProfileReviews(id: number): Promise<UserExerciseProgress[]> {
  return request<UserExerciseProgress[]>(`/api/profiles/${id}/reviews`);
}
