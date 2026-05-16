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
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const stored = window.localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);

    if (selectedProfileId !== null) {
      window.localStorage.setItem(`theme:${selectedProfileId}`, theme);
    }
  }, [theme, selectedProfileId]);

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

          if (typeof window !== "undefined") {
            const profileTheme = window.localStorage.getItem(`theme:${defaultProfileId}`);
            if (profileTheme === "light" || profileTheme === "dark") {
              setTheme(profileTheme);
            }
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
      const profileTheme = window.localStorage.getItem(`theme:${profileId}`);
      if (profileTheme === "light" || profileTheme === "dark") {
        setTheme(profileTheme);
      }
    }
  };

  const handleCreateProfile = async (payload: { name: string; nativeLanguage: string; targetLanguage: string }) => {
    const profile = await createProfile(payload);
    setProfiles((current) => [...current, profile]);
    handleSelectProfile(profile.id);
    return profile;
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <h1>NeoTeacher</h1>
          <p>A lightweight frontend connected to the NeoTeacher backend.</p>
        </div>

        <div className="hero-bar">
          <button type="button" className="button button-secondary" onClick={toggleTheme}>
            Switch to {theme === "light" ? "dark" : "light"} mode
          </button>
        </div>
      </header>

      {error && <ErrorBanner message={error} />}
      {loading ? (
        <Loading />
      ) : selectedProfile && activeExerciseSet ? (
        <LearningSession profile={selectedProfile} exerciseSet={activeExerciseSet} onClose={() => setActiveExerciseSet(null)} />
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
