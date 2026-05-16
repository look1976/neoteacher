import type { Exercise } from "../types";

interface ExercisePromptProps {
  exercise: Exercise;
  answerText: string;
  disabled: boolean;
  submitting: boolean;
  onAnswerTextChange: (value: string) => void;
  onSubmitAnswer: (answer: string) => void;
}

function getPromptPlaceholder(exerciseType: string) {
  if (exerciseType === "fill_gap") {
    return "Type the missing word";
  }

  if (exerciseType === "text_translation" || exerciseType === "sentence_translation") {
    return "Type your answer";
  }

  return "Type your answer";
}

export default function ExercisePrompt({
  exercise,
  answerText,
  disabled,
  submitting,
  onAnswerTextChange,
  onSubmitAnswer,
}: ExercisePromptProps) {
  const answerOptions = [...(exercise.answerOptions ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const isMultipleChoice = exercise.type === "multiple_choice" && answerOptions.length > 0;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f766e", textTransform: "uppercase" }}>
          {exercise.type.replace(/_/g, " ")}
        </div>
        <h2 style={{ margin: "6px 0 0" }}>{exercise.questionText}</h2>
        {exercise.promptText && <p style={{ margin: "8px 0 0", color: "#475569" }}>{exercise.promptText}</p>}
      </div>

      {exercise.imagePath && (
        <img
          src={exercise.imagePath}
          alt=""
          style={{ display: "block", maxWidth: "100%", maxHeight: 280, objectFit: "contain", marginBottom: 16, borderRadius: 8 }}
        />
      )}

      {exercise.audioPath && <audio src={exercise.audioPath} controls style={{ width: "100%", marginBottom: 16 }} />}

      {isMultipleChoice ? (
        <div style={{ display: "grid", gap: 10 }}>
          {answerOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={disabled || submitting}
              onClick={() => onSubmitAnswer(option.text)}
              style={{
                padding: "0.9rem 1rem",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                textAlign: "left",
                cursor: disabled || submitting ? "not-allowed" : "pointer",
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitAnswer(answerText);
          }}
        >
          <input
            value={answerText}
            disabled={disabled || submitting}
            onChange={(event) => onAnswerTextChange(event.target.value)}
            placeholder={getPromptPlaceholder(exercise.type)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "0.9rem 1rem",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            disabled={disabled || submitting || answerText.trim().length === 0}
            style={{
              marginTop: 12,
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1px solid #0f766e",
              backgroundColor: disabled || submitting || answerText.trim().length === 0 ? "#99f6e4" : "#0f766e",
              color: "#ffffff",
              fontWeight: 700,
              cursor: disabled || submitting || answerText.trim().length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Checking..." : "Check answer"}
          </button>
        </form>
      )}
    </div>
  );
}
