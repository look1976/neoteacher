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
    <section className="section card card-body">
      <div className="card-header" style={{ padding: 0 }}>
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="text-muted">
            Active profile: <strong>{profile.name}</strong>
          </p>
        </div>
      </div>

      <div className="grid-columns">
        <div className="card card-surface">
          <div className="card-body">
            <div className="text-muted" style={{ marginBottom: 4 }}>Completed</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{statsLoading ? "..." : completedExercises}</div>
          </div>
        </div>
        <div className="card card-surface">
          <div className="card-body">
            <div className="text-muted" style={{ marginBottom: 4 }}>Correct answers</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{statsLoading ? "..." : `${correctPercent}%`}</div>
          </div>
        </div>
        <div className="card card-surface">
          <div className="card-body">
            <div className="text-muted" style={{ marginBottom: 4 }}>Due reviews</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{statsLoading ? "..." : dueReviews.length}</div>
          </div>
        </div>
        <div className="card card-surface">
          <div className="card-body">
            <div className="text-muted" style={{ marginBottom: 4 }}>Mistakes</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{statsLoading ? "..." : mistakeCount}</div>
          </div>
        </div>
        <div className="card card-surface">
          <div className="card-body">
            <div className="text-muted" style={{ marginBottom: 4 }}>Exercise sets</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{exerciseSets.length}</div>
          </div>
        </div>
        <div className="card card-surface">
          <div className="card-body">
            <div className="text-muted" style={{ marginBottom: 4 }}>Exercises</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{exerciseCount}</div>
          </div>
        </div>
      </div>
      {statsError && <p className="text-muted" style={{ color: "var(--danger)", marginTop: "1rem" }}>{statsError}</p>}
    </section>
  );
}
