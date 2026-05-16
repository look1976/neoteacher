import { useEffect, useMemo, useState } from "react";
import { getProfileProgress, getProfileReviews } from "../api/profiles";
import type { UserExerciseProgress, UserProfile, ExerciseSet } from "../types";

interface DashboardProps {
  profile: UserProfile;
  exerciseSets: ExerciseSet[];
}

export default function Dashboard({ profile, exerciseSets }: DashboardProps) {
  const [progress, setProgress] = useState<UserExerciseProgress[]>([]);
  const [dueReviews, setDueReviews] = useState<UserExerciseProgress[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const exerciseCount = exerciseSets.reduce((count, item) => count + item.exercises.length, 0);
  const completedExercises = useMemo(() => progress.filter((item) => item.attempts > 0).length, [progress]);
  const mistakeCount = useMemo(
    () => progress.filter((item) => item.wrongAttempts > 0 && item.masteryLevel < 5).length,
    [progress]
  );
  const correctAttempts = progress.reduce((count, item) => count + item.correctAttempts, 0);
  const totalAttempts = progress.reduce((count, item) => count + item.attempts, 0);
  const correctPercent = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const [profileProgress, profileReviews] = await Promise.all([
          getProfileProgress(profile.id),
          getProfileReviews(profile.id),
        ]);

        if (!isMounted) {
          return;
        }

        setProgress(profileProgress);
        setDueReviews(profileReviews);
      } catch (err) {
        if (isMounted) {
          setStatsError(err instanceof Error ? err.message : "Failed to load progress");
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [profile.id]);

  return (
    <section style={{ marginBottom: 24, padding: 16, borderRadius: 12, backgroundColor: "#f8fafc" }}>
      <h2>Dashboard</h2>
      <p>
        Active profile: <strong>{profile.name}</strong>
      </p>
      <div style={{ display: "grid", gap: 12, marginTop: 16, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 4 }}>Completed</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{statsLoading ? "..." : completedExercises}</div>
        </div>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 4 }}>Correct answers</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{statsLoading ? "..." : `${correctPercent}%`}</div>
        </div>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 4 }}>Due reviews</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{statsLoading ? "..." : dueReviews.length}</div>
        </div>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 4 }}>Mistakes</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{statsLoading ? "..." : mistakeCount}</div>
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
      {statsError && <p style={{ marginTop: 16, color: "#b91c1c" }}>{statsError}</p>}
    </section>
  );
}
