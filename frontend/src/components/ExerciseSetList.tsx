import type { ExerciseSet } from "../types";

interface ExerciseSetListProps {
  exerciseSets: ExerciseSet[];
}

export default function ExerciseSetList({ exerciseSets }: ExerciseSetListProps) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2>Exercise sets</h2>
      {exerciseSets.length === 0 ? (
        <p>No exercise sets are available from the backend.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {exerciseSets.map((set) => (
            <article key={set.id} style={{ padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{set.title}</h3>
                  <p style={{ margin: "8px 0 0", color: "#475569" }}>{set.description || "No description provided."}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{set.targetLanguage} / {set.nativeLanguage}</div>
                  <div style={{ marginTop: 8, fontWeight: 600 }}>{set.exercises.length} exercises</div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", color: "#64748b", fontSize: "0.85rem" }}>
                <span>{set.level ?? "Level unknown"}</span>
                <span>{set.category ?? "Category unknown"}</span>
                <span>{set.isBuiltIn ? "Built-in" : "Custom"}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
