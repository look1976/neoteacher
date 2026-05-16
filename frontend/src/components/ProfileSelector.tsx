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
    <section className="section">
      <div className="card-body card-header" style={{ padding: 0, border: "none", boxShadow: "none" }}>
        <div>
          <h2 className="section-title">Choose a profile</h2>
          <p className="text-muted">Create or select a profile to continue.</p>
        </div>
        <button type="button" className="button button-secondary" onClick={() => {
            setIsCreating((next) => !next);
            setFormError(null);
          }}>
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
        <div className="grid-list">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className="button button-secondary"
              onClick={() => onSelect(profile.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                borderColor: selectedProfileId === profile.id ? "var(--primary)" : "var(--border-strong)",
                background: selectedProfileId === profile.id ? "rgba(15, 118, 110, 0.1)" : "var(--surface)",
              }}
            >
              <strong>{profile.name}</strong>
              <div className="text-muted" style={{ marginTop: "0.25rem" }}>
                {profile.nativeLanguage} → {profile.targetLanguage}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
