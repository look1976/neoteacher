import { request } from "./client";

export function startLearningSession(payload: { userProfileId: number; exerciseSetId?: number; mode?: string; limit?: number }) {
  return request<{ sessionId: number; mode: string; exercises: unknown[] }>("/api/sessions/learning/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function answerSessionQuestion(sessionId: number, payload: { exerciseId: number; userAnswer: string; timeSpentSeconds?: number; usedHint?: boolean }) {
  return request(`/api/sessions/${sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function finishSession(sessionId: number) {
  return request(`/api/sessions/${sessionId}/finish`, {
    method: "POST",
  });
}

export function getSessionReport(sessionId: number) {
  return request(`/api/sessions/${sessionId}/report`);
}
