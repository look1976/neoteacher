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
    <div className="section card card-body">
      <div style={{ marginBottom: 16 }}>
        <div className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          {exercise.type.replace(/_/g, " ")}
        </div>
        <h2 style={{ margin: "0.4rem 0 0" }}>{exercise.questionText}</h2>
        {exercise.promptText && <p className="text-muted" style={{ marginTop: "0.5rem" }}>{exercise.promptText}</p>}
      </div>

      {exercise.imagePath && (
        <img
          src={exercise.imagePath}
          alt=""
          style={{ display: "block", width: "100%", maxWidth: "100%", maxHeight: 280, objectFit: "contain", marginBottom: 16, borderRadius: 12 }}
        />
      )}

      {exercise.audioPath && <audio src={exercise.audioPath} controls style={{ width: "100%", marginBottom: 16 }} />}

      {isMultipleChoice ? (
        <div className="grid-list">
          {answerOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={disabled || submitting}
              onClick={() => onSubmitAnswer(option.text)}
              className="button button-secondary"
              style={{ textAlign: "left" }}
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
          className="field-group"
        >
          <input
            value={answerText}
            disabled={disabled || submitting}
            onChange={(event) => onAnswerTextChange(event.target.value)}
            placeholder={getPromptPlaceholder(exercise.type)}
            className="input"
          />
          <button
            type="submit"
            disabled={disabled || submitting || answerText.trim().length === 0}
            className="button button-primary"
            style={{ width: "fit-content" }}
          >
            {submitting ? "Checking..." : "Check answer"}
          </button>
        </form>
      )}
    </div>
  );
}
