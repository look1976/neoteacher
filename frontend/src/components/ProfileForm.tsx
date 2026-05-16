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
    <form className="card card-body section" onSubmit={handleSubmit}>
      <div className="field-group">
        <div>
          <label htmlFor="profile-name" className="label">
            Name
          </label>
          <input
            id="profile-name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Anna"
          />
        </div>

        <div className="field-row">
          <div>
            <label htmlFor="profile-native-language" className="label">
              Native language
            </label>
            <select
              id="profile-native-language"
              className="select"
              value={nativeLanguage}
              onChange={(event) => setNativeLanguage(event.target.value)}
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="profile-target-language" className="label">
              Target language
            </label>
            <select
              id="profile-target-language"
              className="select"
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
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
          <div className="text-muted" style={{ color: "var(--danger)", fontSize: "0.95rem" }}>
            {localError ?? error}
          </div>
        )}

        <div className="button-group">
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? "Creating…" : "Create profile"}
          </button>
          <button type="button" className="button button-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
