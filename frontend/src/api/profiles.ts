import { request } from "./client";
import type { UserProfile } from "../types";

export function getProfiles(): Promise<UserProfile[]> {
  return request<UserProfile[]>("/api/profiles");
}

export function getProfile(id: number): Promise<UserProfile> {
  return request<UserProfile>(`/api/profiles/${id}`);
}
