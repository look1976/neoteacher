import { useEffect, useMemo, useState } from "react";
import { getProfiles } from "./api/profiles";
import { getExerciseSets } from "./api/exerciseSets";
import type { UserProfile, ExerciseSet } from "./types";
import ProfileSelector from "./components/ProfileSelector";
import Dashboard from "./components/Dashboard";
import ExerciseSetList from "./components/ExerciseSetList";
import Loading from "./components/Loading";
import ErrorBanner from "./components/ErrorBanner";

function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProfiles, fetchedExerciseSets] = await Promise.all([getProfiles(), getExerciseSets()]);
        setProfiles(fetchedProfiles);
        setExerciseSets(fetchedExerciseSets);
        if (fetchedProfiles.length > 0) {
          setSelectedProfileId((current) => current ?? fetchedProfiles[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId]
  );

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem", fontFamily: "Inter, system-ui, sans-serif", color: "#0f172a" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>NeoTeacher</h1>
        <p style={{ marginTop: 8, color: "#475569" }}>A lightweight frontend connected to the NeoTeacher backend.</p>
      </header>

      {error && <ErrorBanner message={error} />}
      {loading ? (
        <Loading />
      ) : (
        <>
          <ProfileSelector profiles={profiles} selectedProfileId={selectedProfileId} onSelect={setSelectedProfileId} />
          {selectedProfile ? (
            <>
              <Dashboard profile={selectedProfile} exerciseSets={exerciseSets} />
              <ExerciseSetList exerciseSets={exerciseSets} />
            </>
          ) : (
            <p>Select a profile to view the dashboard and exercise sets.</p>
          )}
        </>
      )}
    </main>
  );
}

export default App;
