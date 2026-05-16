import type { UserProfile } from "../types";

interface ProfileSelectorProps {
  profiles: UserProfile[];
  selectedProfileId: number | null;
  onSelect: (profileId: number) => void;
}

export default function ProfileSelector({ profiles, selectedProfileId, onSelect }: ProfileSelectorProps) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2>Choose a profile</h2>
      {profiles.length === 0 ? (
        <p>No profiles found. Please add a profile in the backend or seed the database.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile.id)}
              style={{
                padding: "1rem",
                borderRadius: 8,
                border: selectedProfileId === profile.id ? "2px solid #0f766e" : "1px solid #d1d5db",
                backgroundColor: selectedProfileId === profile.id ? "#ccfbf1" : "#ffffff",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <strong>{profile.name}</strong>
              <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                {profile.nativeLanguage} → {profile.targetLanguage}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
