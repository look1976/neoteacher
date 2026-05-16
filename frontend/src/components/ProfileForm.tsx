import { useState, type FormEvent } from "react";

const LANGUAGE_OPTIONS = ["Polish", "English", "Spanish", "French", "German"];

interface ProfileFormProps {
  onSubmit: (payload: { name: string; nativeLanguage: string; targetLanguage: string }) => Promise<void>;
  onCancel: () => void;
  error?: string | null;
}

export default function ProfileForm({ onSubmit, onCancel, error }: ProfileFormProps) {
  const [name, setName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("Polish");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [localError, setLocalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setLocalError("Name is required.");
      return;
    }

    if (!nativeLanguage || !targetLanguage) {
      setLocalError("Please choose both languages.");
      return;
    }

    if (nativeLanguage === targetLanguage) {
      setLocalError("Native and target language should be different.");
      return;
    }

    setLocalError(null);
    setSaving(true);

    try {
      await onSubmit({ name: trimmedName, nativeLanguage, targetLanguage });
      setName("");
      setNativeLanguage("Polish");
      setTargetLanguage("English");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, backgroundColor: "#f8fafc" }}>
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <label htmlFor="profile-name" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Name
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Anna"
            style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label htmlFor="profile-native-language" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
              Native language
            </label>
            <select
              id="profile-native-language"
              value={nativeLanguage}
              onChange={(event) => setNativeLanguage(event.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #cbd5e1" }}
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="profile-target-language" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
              Target language
            </label>
            <select
              id="profile-target-language"
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #cbd5e1" }}
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(localError || error) && (
          <div style={{ color: "#b91c1c", fontSize: "0.95rem" }}>
            {localError ?? error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1px solid #0f766e",
              backgroundColor: "#0f766e",
              color: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Creating…" : "Create profile"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              backgroundColor: "#fff",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
