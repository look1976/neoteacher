import type { UserProfile, ExerciseSet } from "../types";

interface DashboardProps {
  profile: UserProfile;
  exerciseSets: ExerciseSet[];
}

export default function Dashboard({ profile, exerciseSets }: DashboardProps) {
  const exerciseCount = exerciseSets.reduce((count, item) => count + item.exercises.length, 0);
  return (
    <section style={{ marginBottom: 24, padding: 16, borderRadius: 12, backgroundColor: "#f8fafc" }}>
      <h2>Dashboard</h2>
      <p>
        Active profile: <strong>{profile.name}</strong>
      </p>
      <div style={{ display: "grid", gap: 12, marginTop: 16, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 4 }}>Profiles</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>1</div>
        </div>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 4 }}>Exercise sets</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{exerciseSets.length}</div>
        </div>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 4 }}>Exercises</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{exerciseCount}</div>
        </div>
      </div>
      <p style={{ marginTop: 16, color: "#475569" }}>
        The dashboard is connected to the backend. It will expand with progress tracking, review queues and learning summaries in later phases.
      </p>
    </section>
  );
}
