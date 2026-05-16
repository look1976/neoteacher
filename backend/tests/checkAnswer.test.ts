import { describe, expect, it } from "vitest";
import { checkAnswer } from "../src/lib/checkAnswer";

describe("checkAnswer", () => {
  const exercise = {
    correctAnswers: ["I have got a car"],
    acceptableAnswers: ["I've got a car", "I have a car"],
  };

  it("accepts exact correct answers", () => {
    const result = checkAnswer("I have got a car", exercise);
    expect(result.isCorrect).toBe(true);
    expect(result.feedback).toBe("Correct");
    expect(result.score).toBe(1);
    expect(result.almostCorrect).toBe(false);
  });

  it("accepts acceptable variants", () => {
    const result = checkAnswer("I've got a car", exercise);
    expect(result.isCorrect).toBe(true);
    expect(result.feedback).toBe("Correct");
  });

  it("accepts optional word syntax", () => {
    const altExercise = { correctAnswers: ["I have [got] a car"] };
    const result = checkAnswer("I have a car", altExercise);
    expect(result.isCorrect).toBe(true);
  });

  it("marks near miss as almost correct", () => {
    const result = checkAnswer("I have got a carr", exercise);
    expect(result.isCorrect).toBe(false);
    expect(result.almostCorrect).toBe(true);
    expect(result.feedback).toContain("Almost correct");
  });
});
