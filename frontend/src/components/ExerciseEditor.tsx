import { useMemo, useState } from "react";
import type { AnswerOption, Exercise } from "../types";
import { checkDraftAnswer, createExercise, deleteExercise, updateExercise } from "../api/exercises";

interface ExerciseEditorProps {
  exerciseSetId: number;
  exercise?: Exercise | null;
  onSaved: (exercise: Exercise) => void;
  onClose: () => void;
  onDeleted?: () => void;
}

const exerciseTypes = ["multiple_choice", "sentence_translation", "fill_gap"] as const;

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }
  return [];
}

function formatArrayInput(values: string[]) {
  return values.join("\n");
}

function parseArrayInput(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export default function ExerciseEditor({ exerciseSetId, exercise, onSaved, onClose, onDeleted }: ExerciseEditorProps) {
  const [type, setType] = useState(exercise?.type ?? "sentence_translation");
  const [questionText, setQuestionText] = useState(exercise?.questionText ?? "");
  const [promptText, setPromptText] = useState(exercise?.promptText ?? "");
  const [correctAnswersText, setCorrectAnswersText] = useState(() => formatArrayInput(parseStringArray(exercise?.correctAnswers)));
  const [acceptableAnswersText, setAcceptableAnswersText] = useState(() => formatArrayInput(parseStringArray(exercise?.acceptableAnswers)));
  const [explanation, setExplanation] = useState(exercise?.explanation ?? "");
  const [difficulty, setDifficulty] = useState(exercise?.difficulty ?? "");
  const [tagsText, setTagsText] = useState(() => formatArrayInput(parseStringArray(exercise?.tags)));
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>(
    exercise?.answerOptions?.length
      ? exercise.answerOptions
      : [{ text: "", isCorrect: false, exerciseId: 0, id: 0, imagePath: null, audioPath: null, sortOrder: 0 }]
  );
  const [draftAnswer, setDraftAnswer] = useState("");
  const [draftResult, setDraftResult] = useState<unknown | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);

  const correctAnswers = useMemo(() => parseArrayInput(correctAnswersText), [correctAnswersText]);
  const acceptableAnswers = useMemo(() => parseArrayInput(acceptableAnswersText), [acceptableAnswersText]);
  const tags = useMemo(() => parseArrayInput(tagsText), [tagsText]);

  const isMultipleChoice = type === "multiple_choice";

  const canSave = questionText.trim().length > 0 && correctAnswers.length > 0;

  const answerOptionFields = useMemo(
    () => answerOptions.map((option, index) => ({
      ...option,
      index,
    })),
    [answerOptions]
  );

  function updateAnswerOption(index: number, update: Partial<AnswerOption>) {
    setAnswerOptions((current) =>
      current.map((option, idx) => (idx === index ? { ...option, ...update } : option))
    );
  }

  function addAnswerOption() {
    setAnswerOptions((current) => [
      ...current,
      { text: "", isCorrect: false, exerciseId: 0, id: 0, imagePath: null, audioPath: null, sortOrder: current.length },
    ]);
  }

  function removeAnswerOption(index: number) {
    setAnswerOptions((current) => current.filter((_, idx) => idx !== index));
  }

  async function handleSave() {
    if (!canSave) {
      setSavingError("A question and at least one correct answer are required.");
      return;
    }

    setSaving(true);
    setSavingError(null);

    const payload = {
      exerciseSetId,
      type,
      questionText: questionText.trim(),
      promptText: promptText.trim() || undefined,
      correctAnswers,
      acceptableAnswers: acceptableAnswers.length > 0 ? acceptableAnswers : undefined,
      explanation: explanation.trim() || undefined,
      difficulty: difficulty.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      answerOptions: isMultipleChoice
        ? answerOptions
            .filter((option) => option.text.trim().length > 0)
            .map((option, index) => ({
              text: option.text.trim(),
              isCorrect: option.isCorrect,
              sortOrder: index,
            }))
        : undefined,
    };

    try {
      const savedExercise = exercise?.id
        ? await updateExercise(exercise.id, payload)
        : await createExercise(payload);

      onSaved(savedExercise);
    } catch (error) {
      setSavingError(error instanceof Error ? error.message : "Failed to save exercise");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!exercise?.id || !onDeleted) {
      return;
    }

    if (!window.confirm("Delete this exercise?")) {
      return;
    }

    try {
      await deleteExercise(exercise.id);
      onDeleted();
    } catch (error) {
      setSavingError(error instanceof Error ? error.message : "Failed to delete exercise");
    }
  }

  async function handleTestAnswer() {
    if (draftAnswer.trim().length === 0) {
      setDraftError("Enter an answer to test against the current draft.");
      setDraftResult(null);
      return;
    }

    setDraftError(null);
    setDraftResult(null);

    try {
      const result = await checkDraftAnswer({
        userAnswer: draftAnswer.trim(),
        correctAnswers,
        acceptableAnswers,
      });
      setDraftResult(result);
    } catch (error) {
      setDraftError(error instanceof Error ? error.message : "Could not test answer");
    }
  }

  return (
    <section className="section card card-body">
      <div className="card-header" style={{ padding: 0, marginBottom: 16 }}>
        <div>
          <h2 className="section-title">{exercise ? "Edit exercise" : "New exercise"}</h2>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>
            Build a draft exercise for your custom set.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Type
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {exerciseTypes.map((value) => (
              <option key={value} value={value}>
                {value.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>

        <label>
          Question text
          <textarea value={questionText} onChange={(event) => setQuestionText(event.target.value)} rows={3} />
        </label>

        <label>
          Prompt text
          <textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} rows={2} />
        </label>

        <label>
          Correct answers (one per line)
          <textarea value={correctAnswersText} onChange={(event) => setCorrectAnswersText(event.target.value)} rows={3} />
        </label>

        <label>
          Acceptable answers (optional)
          <textarea value={acceptableAnswersText} onChange={(event) => setAcceptableAnswersText(event.target.value)} rows={3} />
        </label>

        <label>
          Explanation
          <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} rows={3} />
        </label>

        <label>
          Difficulty
          <input type="text" value={difficulty} onChange={(event) => setDifficulty(event.target.value)} />
        </label>

        <label>
          Tags (one per line)
          <textarea value={tagsText} onChange={(event) => setTagsText(event.target.value)} rows={3} />
        </label>
      </div>

      {isMultipleChoice && (
        <div className="section" style={{ marginTop: 24 }}>
          <h3 className="section-title">Multiple choice options</h3>
          {answerOptionFields.map((option) => (
            <div key={option.index} className="form-row" style={{ alignItems: "center", gap: 8 }}>
              <input
                type="text"
                placeholder={`Option ${option.index + 1}`}
                value={option.text}
                onChange={(event) => updateAnswerOption(option.index, { text: event.target.value })}
                style={{ flex: 1 }}
              />
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(event) => updateAnswerOption(option.index, { isCorrect: event.target.checked })}
                />
                Correct
              </label>
              <button type="button" className="button button-secondary" onClick={() => removeAnswerOption(option.index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="button button-secondary" onClick={addAnswerOption} style={{ marginTop: 12 }}>
            Add option
          </button>
        </div>
      )}

      <div className="section" style={{ marginTop: 24 }}>
        <h3 className="section-title">Preview</h3>
        <p>
          <strong>Question:</strong> {questionText || "(enter a question)"}
        </p>
        <p>
          <strong>Correct answers:</strong> {correctAnswers.join(", ") || "(none)"}
        </p>
        <p>
          <strong>Acceptable answers:</strong> {acceptableAnswers.join(", ") || "(none)"}
        </p>
      </div>

      <div className="section" style={{ marginTop: 24 }}>
        <h3 className="section-title">Test draft answer</h3>
        <div className="form-row" style={{ gap: 12, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Enter answer to test"
            value={draftAnswer}
            onChange={(event) => setDraftAnswer(event.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" className="button button-primary" onClick={handleTestAnswer}>
            Test answer
          </button>
        </div>
        {draftError && <p className="text-error" style={{ marginTop: 8 }}>{draftError}</p>}
        {draftResult != null && (
          <pre className="card card-body" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(draftResult, null, 2)}
          </pre>
        )}
      </div>

      {savingError && <p className="text-error" style={{ marginTop: 16 }}>{savingError}</p>}

      <div className="form-row" style={{ marginTop: 24, justifyContent: "flex-end" }}>
        {exercise?.id && onDeleted ? (
          <button type="button" className="button button-secondary" onClick={handleDelete} disabled={saving}>
            Delete exercise
          </button>
        ) : null}
        <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button type="button" className="button button-primary" onClick={handleSave} disabled={saving || !canSave}>
          {exercise ? "Save exercise" : "Create exercise"}
        </button>
      </div>
    </section>
  );
}
