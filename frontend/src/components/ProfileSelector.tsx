import { useState } from "react";
import type { UserProfile } from "../types";
import ProfileForm from "./ProfileForm";

interface ProfileSelectorProps {
  profiles: UserProfile[];
  selectedProfileId: number | null;
  onSelect: (profileId: number) => void;
  onCreate: (payload: { name: string; nativeLanguage: string; targetLanguage: string }) => Promise<UserProfile>;
}

export default function ProfileSelector({ profiles, selectedProfileId, onSelect, onCreate }: ProfileSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <section style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Choose a profile</h2>
          <p style={{ margin: "8px 0 0", color: "#475569" }}>Create or select a profile to continue.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsCreating((next) => !next);
            setFormError(null);
          }}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: 8,
            border: "1px solid #0f766e",
            backgroundColor: isCreating ? "#f0fdf4" : "#0f766e",
            color: isCreating ? "#0f766e" : "#ffffff",
            cursor: "pointer",
          }}
        >
          {isCreating ? "Cancel" : "Create profile"}
        </button>
      </div>

      {isCreating ? (
        <ProfileForm
          onSubmit={async (payload) => {
            try {
              setFormError(null);
              await onCreate(payload);
              setIsCreating(false);
            } catch (error) {
              setFormError(error instanceof Error ? error.message : "Failed to create profile");
            }
          }}
          onCancel={() => {
            setIsCreating(false);
            setFormError(null);
          }}
          error={formError}
        />
      ) : profiles.length === 0 ? (
        <p>No profiles found. Please create a profile to begin.</p>
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
