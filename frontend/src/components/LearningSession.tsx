import { useEffect, useMemo, useState } from "react";
import { answerSessionQuestion, finishSession, startLearningSession } from "../api/sessions";
import { getGrammarNoteById } from "../api/grammarNotes";
import type { AnswerCheckResponse, Exercise, ExerciseSet, GrammarNote, SessionReport, UserProfile } from "../types";
import ErrorBanner from "./ErrorBanner";
import ExercisePrompt from "./ExercisePrompt";
import GrammarNotePanel from "./GrammarNotePanel";
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

function getResultClass(result: AnswerCheckResponse) {
  if (result.isCorrect) {
    return "result-card result-correct";
  }

  if (result.almostCorrect) {
    return "result-card result-almost";
  }

  return "result-card result-wrong";
}

export default function LearningSession({ profile, exerciseSet, onClose }: LearningSessionProps) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [initialExerciseCount, setInitialExerciseCount] = useState(0);
  const [queue, setQueue] = useState<Exercise[]>([]);
  const [repeatCounts, setRepeatCounts] = useState<Record<number, number>>({});
  const [answerText, setAnswerText] = useState("");
  const [answerResult, setAnswerResult] = useState<AnswerCheckResponse | null>(null);
  const [report, setReport] = useState<SessionReport | null>(null);
  const [grammarNote, setGrammarNote] = useState<GrammarNote | null>(null);
  const [showGrammarNote, setShowGrammarNote] = useState(false);
  const [loadingGrammarNote, setLoadingGrammarNote] = useState(false);
  const [grammarError, setGrammarError] = useState<string | null>(null);
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
    setShowGrammarNote(false);
    setGrammarNote(null);
    setGrammarError(null);
    setQuestionStartedAt(Date.now());

    if (nextQueue.length === 0) {
      await finishCurrentSession();
    }
  }

  useEffect(() => {
    setShowGrammarNote(false);
    setGrammarNote(null);
    setGrammarError(null);
    setLoadingGrammarNote(false);
  }, [currentExercise?.grammarNoteId]);

  async function loadGrammarNote() {
    if (!currentExercise?.grammarNoteId || grammarNote || loadingGrammarNote) {
      setShowGrammarNote(true);
      return;
    }

    try {
      setLoadingGrammarNote(true);
      setGrammarError(null);
      const note = await getGrammarNoteById(currentExercise.grammarNoteId);
      setGrammarNote(note);
      setShowGrammarNote(true);
    } catch (err) {
      setGrammarError(err instanceof Error ? err.message : "Could not load grammar note");
    } finally {
      setLoadingGrammarNote(false);
    }
  }

  if (loading) {
    return (
      <section className="section">
        <Loading />
      </section>
    );
  }

  if (report) {
    return (
      <section className="section card card-body">
        <div className="card-header" style={{ padding: 0 }}>
          <div>
            <h2 className="section-title">Session complete</h2>
            <p className="text-muted" style={{ marginTop: "0.5rem" }}>{exerciseSet.title}</p>
          </div>
          <button type="button" className="button button-secondary" onClick={onClose}>
            Back to dashboard
          </button>
        </div>

        <div className="grid-columns" style={{ marginTop: "1rem" }}>
          <div className="card card-surface">
            <div className="card-body">
              <div className="text-muted" style={{ marginBottom: 4 }}>Score</div>
              <strong style={{ fontSize: "1.5rem" }}>{Math.round(report.scorePercent)}%</strong>
            </div>
          </div>
          <div className="card card-surface">
            <div className="card-body">
              <div className="text-muted" style={{ marginBottom: 4 }}>Correct</div>
              <strong style={{ fontSize: "1.5rem" }}>{report.correctAnswers}</strong>
            </div>
          </div>
          <div className="card card-surface">
            <div className="card-body">
              <div className="text-muted" style={{ marginBottom: 4 }}>Answered</div>
              <strong style={{ fontSize: "1.5rem" }}>{completedAnswers}</strong>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentExercise) {
    return (
      <section className="section">
        {error && <ErrorBanner message={error} />}
        <button type="button" className="button button-secondary" onClick={onClose}>
          Back to dashboard
        </button>
      </section>
    );
  }

  const correctAnswerText = formatAnswerList(answerResult?.correctAnswers);
  const acceptableAnswerText = formatAnswerList(answerResult?.acceptableAnswers);

  return (
    <section className="section card card-body">
      <div className="card-header" style={{ marginBottom: 18 }}>
        <div>
          <h1 className="typed-heading">{exerciseSet.title}</h1>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>
            {profile.name} · Question {Math.min(answeredThisSession + 1, initialExerciseCount)} of {initialExerciseCount}
          </p>
        </div>
        <button type="button" className="button button-secondary" onClick={onClose}>
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

      {currentExercise.grammarNoteId && (
        <div className="button-group" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="button button-ghost"
            onClick={loadGrammarNote}
            disabled={loadingGrammarNote}
          >
            {loadingGrammarNote ? "Loading explanation…" : showGrammarNote ? "Hide explanation" : "Show explanation"}
          </button>
        </div>
      )}

      {grammarError && <ErrorBanner message={grammarError} />}

      {showGrammarNote && grammarNote && <GrammarNotePanel note={grammarNote} />}

      {answerResult && (
        <div className={getResultClass(answerResult)}>
          <strong>{answerResult.feedback}</strong>
          {correctAnswerText && !answerResult.isCorrect && (
            <p style={{ margin: "0.5rem 0 0" }}>Model answer: {correctAnswerText}</p>
          )}
          {acceptableAnswerText && !answerResult.isCorrect && (
            <p style={{ margin: "0.5rem 0 0" }}>Also accepted: {acceptableAnswerText}</p>
          )}
          {answerResult.explanation && <p style={{ margin: "0.5rem 0 0" }}>{answerResult.explanation}</p>}
          {!answerResult.isCorrect && (repeatCounts[currentExercise.id] ?? 0) < 1 && (
            <p style={{ margin: "0.5rem 0 0" }}>This question will appear once more before the session ends.</p>
          )}
          <button
            type="button"
            onClick={continueSession}
            disabled={finishing}
            className="button button-primary"
            style={{ marginTop: 12 }}
          >
            {finishing ? "Finishing..." : queue.length > 1 ? "Next question" : "Finish session"}
          </button>
        </div>
      )}
    </section>
  );
}
