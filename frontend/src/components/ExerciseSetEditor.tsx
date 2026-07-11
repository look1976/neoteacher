import { useEffect, useMemo, useState } from "react";
import type { Exercise, ExerciseSet } from "../types";
import { createExerciseSet, deleteExerciseSet, updateExerciseSet } from "../api/exerciseSets";
import { createExercise, deleteExercise, updateExercise } from "../api/exercises";
import ExerciseEditor from "./ExerciseEditor";

interface ExerciseSetEditorProps {
  exerciseSet?: ExerciseSet | null;
  onSaved: (exerciseSet: ExerciseSet) => void;
  onClose: () => void;
}

export default function ExerciseSetEditor({ exerciseSet, onSaved, onClose }: ExerciseSetEditorProps) {
  const [title, setTitle] = useState(exerciseSet?.title ?? "");
  const [description, setDescription] = useState(exerciseSet?.description ?? "");
  const [nativeLanguage, setNativeLanguage] = useState(exerciseSet?.nativeLanguage ?? "");
  const [targetLanguage, setTargetLanguage] = useState(exerciseSet?.targetLanguage ?? "");
  const [level, setLevel] = useState(exerciseSet?.level ?? "");
  const [category, setCategory] = useState(exerciseSet?.category ?? "");
  const [savedSet, setSavedSet] = useState<ExerciseSet | null>(exerciseSet ?? null);
  const [exercises, setExercises] = useState<Exercise[]>(exerciseSet?.exercises ?? []);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSavedSet(exerciseSet ?? null);
    setExercises(exerciseSet?.exercises ?? []);
  }, [exerciseSet]);

  const canSaveSet = title.trim().length > 0 && nativeLanguage.trim().length > 0 && targetLanguage.trim().length > 0;

  const exerciseSummary = useMemo(() => {
    return exercises.map((item) => ({ id: item.id, text: item.questionText })).slice(0, 10);
  }, [exercises]);

  async function handleSaveExerciseSet() {
    if (!canSaveSet) {
      setError("Title, native language, and target language are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      nativeLanguage: nativeLanguage.trim(),
      targetLanguage: targetLanguage.trim(),
      level: level.trim() || undefined,
      category: category.trim() || undefined,
    };

    try {
      const saved = savedSet?.id
        ? await updateExerciseSet(savedSet.id, payload)
        : await createExerciseSet(payload);

      setSavedSet(saved);
      onSaved({ ...saved, exercises });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save exercise set");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteExercise(exerciseId: number) {
    try {
      await deleteExercise(exerciseId);
      const updatedExercises = exercises.filter((item) => item.id !== exerciseId);
      setExercises(updatedExercises);
      setEditingExercise(null);
      if (savedSet) {
        onSaved({ ...savedSet, exercises: updatedExercises });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete exercise");
    }
  }

  function handleSavedExercise(savedExercise: Exercise) {
    const updatedExercises = exercises.some((item) => item.id === savedExercise.id)
      ? exercises.map((item) => (item.id === savedExercise.id ? savedExercise : item))
      : [...exercises, savedExercise];

    setExercises(updatedExercises);
    setEditingExercise(null);
    if (savedSet) {
      onSaved({ ...savedSet, exercises: updatedExercises });
    }
  }

  if (editingExercise) {
    return (
      <ExerciseEditor
        exerciseSetId={savedSet?.id ?? exerciseSet?.id ?? 0}
        exercise={editingExercise}
        onSaved={handleSavedExercise}
        onDeleted={() => {
          if (editingExercise?.id) {
            handleDeleteExercise(editingExercise.id);
          }
        }}
        onClose={() => setEditingExercise(null)}
      />
    );
  }

  return (
    <section className="section card card-body">
      <div className="card-header" style={{ padding: 0, marginBottom: 16 }}>
        <div>
          <h2 className="section-title">{savedSet ? "Edit exercise set" : "Create a new exercise set"}</h2>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>
            Define set metadata and add exercises for your custom practice.
          </p>
        </div>
      </div>

      {error && <p className="text-error" style={{ marginBottom: 16 }}>{error}</p>}

      <div className="form-grid">
        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>

        <label>
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} />
        </label>

        <label>
          Native language
          <input value={nativeLanguage} onChange={(event) => setNativeLanguage(event.target.value)} />
        </label>

        <label>
          Target language
          <input value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)} />
        </label>

        <label>
          Level
          <input value={level} onChange={(event) => setLevel(event.target.value)} />
        </label>

        <label>
          Category
          <input value={category} onChange={(event) => setCategory(event.target.value)} />
        </label>
      </div>

      <div className="form-row" style={{ marginTop: 24, justifyContent: "flex-end" }}>
        <button type="button" className="button button-secondary" onClick={onClose} disabled={loading}>
          Close
        </button>
        <button type="button" className="button button-primary" onClick={handleSaveExerciseSet} disabled={loading || !canSaveSet}>
          {savedSet ? "Save set" : "Create set"}
        </button>
      </div>

      {savedSet ? (
        <div className="section" style={{ marginTop: 24 }}>
          <div className="card-header" style={{ padding: 0 }}>
            <h3 className="section-title">Exercises</h3>
            <button type="button" className="button button-primary" onClick={() => setEditingExercise({
              id: 0,
              exerciseSetId: savedSet.id,
              type: "sentence_translation",
              questionText: "",
              correctAnswers: [],
              answerOptions: [],
            } as Exercise)}>
              Add exercise
            </button>
          </div>

          {exerciseSummary.length === 0 ? (
            <p>No exercises added yet.</p>
          ) : (
            <div className="grid-list" style={{ gap: 12 }}>
              {exerciseSummary.map((item) => (
                <article key={item.id} className="card card-body">
                  <div className="card-header" style={{ padding: 0 }}>
                    <p style={{ margin: 0 }}>{item.text || "Untitled exercise"}</p>
                  </div>
                  <div className="form-row" style={{ justifyContent: "flex-end", gap: 8 }}>
                    <button type="button" className="button button-secondary" onClick={() => {
                      const match = exercises.find((exerciseItem) => exerciseItem.id === item.id);
                      if (match) {
                        setEditingExercise(match);
                      }
                    }}>
                      Edit
                    </button>
                    <button type="button" className="button button-secondary" onClick={() => handleDeleteExercise(item.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
