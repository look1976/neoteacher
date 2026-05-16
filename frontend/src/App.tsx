import { useEffect, useMemo, useState } from "react";
import { createProfile, getProfiles } from "./api/profiles";
import { getExerciseSets } from "./api/exerciseSets";
import type { UserProfile, ExerciseSet } from "./types";
import ProfileSelector from "./components/ProfileSelector";
import Dashboard from "./components/Dashboard";
import ExerciseSetList from "./components/ExerciseSetList";
import Loading from "./components/Loading";
import ErrorBanner from "./components/ErrorBanner";
import LearningSession from "./components/LearningSession";

function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("selectedProfileId") : null;
    return stored ? Number(stored) : null;
  });
  const [activeExerciseSet, setActiveExerciseSet] = useState<ExerciseSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProfiles, fetchedExerciseSets] = await Promise.all([getProfiles(), getExerciseSets()]);
        setProfiles(fetchedProfiles);
        setExerciseSets(fetchedExerciseSets);

        const storedId = typeof window !== "undefined" ? Number(window.localStorage.getItem("selectedProfileId")) : null;
        const validStoredId = fetchedProfiles.some((profile) => profile.id === storedId) ? storedId : null;
        const defaultProfileId = validStoredId ?? (fetchedProfiles.length > 0 ? fetchedProfiles[0].id : null);
        if (defaultProfileId !== null) {
          setSelectedProfileId(defaultProfileId);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("selectedProfileId", String(defaultProfileId));
          }
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

  const handleSelectProfile = (profileId: number) => {
    setSelectedProfileId(profileId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("selectedProfileId", String(profileId));
    }
  };

  const handleCreateProfile = async (payload: { name: string; nativeLanguage: string; targetLanguage: string }) => {
    const profile = await createProfile(payload);
    setProfiles((current) => [...current, profile]);
    handleSelectProfile(profile.id);
    return profile;
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem", fontFamily: "Inter, system-ui, sans-serif", color: "#0f172a" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>NeoTeacher</h1>
        <p style={{ marginTop: 8, color: "#475569" }}>A lightweight frontend connected to the NeoTeacher backend.</p>
      </header>

      {error && <ErrorBanner message={error} />}
      {loading ? (
        <Loading />
      ) : selectedProfile && activeExerciseSet ? (
        <LearningSession
          profile={selectedProfile}
          exerciseSet={activeExerciseSet}
          onClose={() => setActiveExerciseSet(null)}
        />
      ) : (
        <>
          <ProfileSelector
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelect={handleSelectProfile}
            onCreate={handleCreateProfile}
          />
          {selectedProfile ? (
            <>
              <Dashboard profile={selectedProfile} exerciseSets={exerciseSets} />
              <ExerciseSetList exerciseSets={exerciseSets} canStart={Boolean(selectedProfile)} onStart={setActiveExerciseSet} />
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
