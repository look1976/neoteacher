import type { ExerciseSet } from "../types";

interface ExerciseSetListProps {
  exerciseSets: ExerciseSet[];
  canStart: boolean;
  onStart: (exerciseSet: ExerciseSet) => void;
  onEdit: (exerciseSet: ExerciseSet) => void;
}

export default function ExerciseSetList({ exerciseSets, canStart, onStart, onEdit }: ExerciseSetListProps) {
  return (
    <section className="section">
      <h2 className="section-title">Exercise sets</h2>
      {exerciseSets.length === 0 ? (
        <p>No exercise sets are available from the backend.</p>
      ) : (
        <div className="grid-list">
          {exerciseSets.map((set) => (
            <article key={set.id} className="card">
              <div className="card-body">
                <div className="card-header">
                  <div>
                    <h3 style={{ margin: 0 }}>{set.title}</h3>
                    <p className="text-muted" style={{ marginTop: "0.5rem" }}>
                      {set.description || "No description provided."}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {set.targetLanguage} / {set.nativeLanguage}
                    </div>
                    <div style={{ marginTop: 8, fontWeight: 600 }}>{set.exercises.length} exercises</div>
                  </div>
                </div>
                <div className="card-header" style={{ marginTop: 12, gap: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, color: "var(--muted)", fontSize: "0.85rem" }}>
                    <span>{set.level ?? "Level unknown"}</span>
                    <span>{set.category ?? "Category unknown"}</span>
                    <span>{set.isBuiltIn ? "Built-in" : "Custom"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button type="button" className="button button-secondary" onClick={() => onEdit(set)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button button-primary"
                    disabled={!canStart || set.exercises.length === 0}
                    onClick={() => onStart(set)}
                  >
                    Start lesson
                  </button>
                </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
