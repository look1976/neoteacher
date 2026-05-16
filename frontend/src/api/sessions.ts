import { request } from "./client";
import type { AnswerCheckResponse, LearningSessionResponse, SessionReport } from "../types";

export function startLearningSession(payload: { userProfileId: number; exerciseSetId?: number; mode?: string; limit?: number }) {
  return request<LearningSessionResponse>("/api/sessions/learning/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function answerSessionQuestion(sessionId: number, payload: { exerciseId: number; userAnswer: string; timeSpentSeconds?: number; usedHint?: boolean }) {
  return request<AnswerCheckResponse>(`/api/sessions/${sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function finishSession(sessionId: number) {
  return request<SessionReport>(`/api/sessions/${sessionId}/finish`, {
    method: "POST",
  });
}

export function getSessionReport(sessionId: number) {
  return request<SessionReport>(`/api/sessions/${sessionId}/report`);
}
