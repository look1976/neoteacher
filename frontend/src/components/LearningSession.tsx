import { useEffect, useMemo, useState } from "react";
import { answerSessionQuestion, finishSession, startLearningSession } from "../api/sessions";
import type { AnswerCheckResponse, Exercise, ExerciseSet, SessionReport, UserProfile } from "../types";
import ErrorBanner from "./ErrorBanner";
import ExercisePrompt from "./ExercisePrompt";
import Loading from "./Loading";

interface LearningSessionProps {
  profile: UserProfile;
  exerciseSet: ExerciseSet;
  onClose: () => void;
}

function formatAnswerList(value: unknown): string | null {
  if (Array.isArray(value)) {
    const answers = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    return answers.length > 0 ? answers.join(", ") : null;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return null;
}

function getResultStyles(result: AnswerCheckResponse) {
  if (result.isCorrect) {
    return {
      backgroundColor: "#dcfce7",
      borderColor: "#86efac",
      color: "#166534",
    };
  }

  if (result.almostCorrect) {
    return {
      backgroundColor: "#fef9c3",
      borderColor: "#fde68a",
      color: "#854d0e",
    };
  }

  return {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    color: "#991b1b",
  };
}

export default function LearningSession({ profile, exerciseSet, onClose }: LearningSessionProps) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [initialExerciseCount, setInitialExerciseCount] = useState(0);
  const [queue, setQueue] = useState<Exercise[]>([]);
  const [repeatCounts, setRepeatCounts] = useState<Record<number, number>>({});
  const [answerText, setAnswerText] = useState("");
  const [answerResult, setAnswerResult] = useState<AnswerCheckResponse | null>(null);
  const [report, setReport] = useState<SessionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());

  const currentExercise = queue[0] ?? null;
  const completedAnswers = report?.totalQuestions ?? 0;
  const answeredThisSession = useMemo(() => {
    if (report) {
      return report.totalQuestions;
    }

    return initialExerciseCount - queue.length + (answerResult ? 1 : 0);
  }, [answerResult, initialExerciseCount, queue.length, report]);

  useEffect(() => {
    let isMounted = true;

    async function startSession() {
      try {
        setLoading(true);
        setError(null);
        const response = await startLearningSession({
          userProfileId: profile.id,
          exerciseSetId: exerciseSet.id,
          mode: "learning",
        });

        if (!isMounted) {
          return;
        }

        setSessionId(response.sessionId);
        setQueue(response.exercises);
        setInitialExerciseCount(response.exercises.length);
        setQuestionStartedAt(Date.now());
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to start learning session");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    startSession();

    return () => {
      isMounted = false;
    };
  }, [exerciseSet.id, profile.id]);

  async function submitAnswer(userAnswer: string) {
    if (!currentExercise || sessionId === null || userAnswer.trim().length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const elapsedSeconds = Math.max(0, Math.round((Date.now() - questionStartedAt) / 1000));
      const result = await answerSessionQuestion(sessionId, {
        exerciseId: currentExercise.id,
        userAnswer: userAnswer.trim(),
        timeSpentSeconds: elapsedSeconds,
      });
      setAnswerResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  }

  async function finishCurrentSession() {
    if (sessionId === null) {
      return;
    }

    try {
      setFinishing(true);
      setError(null);
      const sessionReport = await finishSession(sessionId);
      setReport(sessionReport);
      setQueue([]);
      setAnswerResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to finish session");
    } finally {
      setFinishing(false);
    }
  }

  async function continueSession() {
    if (!currentExercise || !answerResult) {
      return;
    }

    const remainingQueue = queue.slice(1);
    const repeatCount = repeatCounts[currentExercise.id] ?? 0;
    const shouldRepeat = !answerResult.isCorrect && repeatCount < 1;
    const nextQueue = shouldRepeat ? [...remainingQueue, currentExercise] : remainingQueue;

    setRepeatCounts((current) =>
      shouldRepeat ? { ...current, [currentExercise.id]: repeatCount + 1 } : current
    );
    setQueue(nextQueue);
    setAnswerText("");
    setAnswerResult(null);
    setQuestionStartedAt(Date.now());

    if (nextQueue.length === 0) {
      await finishCurrentSession();
    }
  }

  if (loading) {
    return (
      <section style={{ marginBottom: 24 }}>
        <Loading />
      </section>
    );
  }

  if (report) {
    return (
      <section style={{ marginBottom: 24, padding: 16, borderRadius: 8, border: "1px solid #cbd5e1", backgroundColor: "#ffffff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>Session complete</h2>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>{exerciseSet.title}</p>
          </div>
          <button type="button" onClick={onClose} style={{ padding: "0.6rem 0.9rem", borderRadius: 8, border: "1px solid #cbd5e1", backgroundColor: "#ffffff" }}>
            Back to dashboard
          </button>
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginTop: 16 }}>
          <div style={{ padding: 12, borderRadius: 8, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Score</div>
            <strong style={{ fontSize: "1.5rem" }}>{Math.round(report.scorePercent)}%</strong>
          </div>
          <div style={{ padding: 12, borderRadius: 8, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Correct</div>
            <strong style={{ fontSize: "1.5rem" }}>{report.correctAnswers}</strong>
          </div>
          <div style={{ padding: 12, borderRadius: 8, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Answered</div>
            <strong style={{ fontSize: "1.5rem" }}>{completedAnswers}</strong>
          </div>
        </div>
      </section>
    );
  }

  if (!currentExercise) {
    return (
      <section style={{ marginBottom: 24 }}>
        {error && <ErrorBanner message={error} />}
        <button type="button" onClick={onClose} style={{ padding: "0.6rem 0.9rem", borderRadius: 8, border: "1px solid #cbd5e1", backgroundColor: "#ffffff" }}>
          Back to dashboard
        </button>
      </section>
    );
  }

  const correctAnswerText = formatAnswerList(answerResult?.correctAnswers);
  const acceptableAnswerText = formatAnswerList(answerResult?.acceptableAnswers);

  return (
    <section style={{ marginBottom: 24, padding: 16, borderRadius: 8, border: "1px solid #cbd5e1", backgroundColor: "#ffffff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>{exerciseSet.title}</h1>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>
            {profile.name} · Question {Math.min(answeredThisSession + 1, initialExerciseCount)} of {initialExerciseCount}
          </p>
        </div>
        <button type="button" onClick={onClose} style={{ padding: "0.6rem 0.9rem", borderRadius: 8, border: "1px solid #cbd5e1", backgroundColor: "#ffffff" }}>
          Exit lesson
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      <ExercisePrompt
        exercise={currentExercise}
        answerText={answerText}
        disabled={answerResult !== null}
        submitting={submitting}
        onAnswerTextChange={setAnswerText}
        onSubmitAnswer={submitAnswer}
      />

      {answerResult && (
        <div
          style={{
            marginTop: 18,
            padding: 14,
            borderRadius: 8,
            border: `1px solid ${getResultStyles(answerResult).borderColor}`,
            ...getResultStyles(answerResult),
          }}
        >
          <strong>{answerResult.feedback}</strong>
          {correctAnswerText && !answerResult.isCorrect && (
            <p style={{ margin: "8px 0 0" }}>Model answer: {correctAnswerText}</p>
          )}
          {acceptableAnswerText && !answerResult.isCorrect && (
            <p style={{ margin: "8px 0 0" }}>Also accepted: {acceptableAnswerText}</p>
          )}
          {answerResult.explanation && <p style={{ margin: "8px 0 0" }}>{answerResult.explanation}</p>}
          {!answerResult.isCorrect && (repeatCounts[currentExercise.id] ?? 0) < 1 && (
            <p style={{ margin: "8px 0 0" }}>This question will appear once more before the session ends.</p>
          )}
          <button
            type="button"
            onClick={continueSession}
            disabled={finishing}
            style={{
              marginTop: 12,
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1px solid #0f766e",
              backgroundColor: "#0f766e",
              color: "#ffffff",
              fontWeight: 700,
              cursor: finishing ? "wait" : "pointer",
            }}
          >
            {finishing ? "Finishing..." : queue.length > 1 ? "Next question" : "Finish session"}
          </button>
        </div>
      )}
    </section>
  );
}
