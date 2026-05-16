import { describe, expect, it } from "vitest";
import { exerciseSets, grammarNotes } from "../prisma/seed";

describe("seed data", () => {
  it("creates at least 5 exercise sets", () => {
    expect(exerciseSets.length).toBeGreaterThanOrEqual(5);
  });

  it("includes the required grammar note topics", () => {
    const requiredTitles = [
      "Present Simple",
      "Past Simple",
      "Articles: a/an/the",
      "Questions with do/does/did",
      "There is / There are",
    ];

    const existingTitles = grammarNotes.map((note) => note.title);
    requiredTitles.forEach((title) => expect(existingTitles).toContain(title));
  });

  it("has at least one exercise set with exercises referencing grammar notes", () => {
    const hasGrammarNoteReference = exerciseSets.some((set) =>
      set.exercises.some((exercise) => Boolean(exercise.grammarNoteTitle))
    );

    expect(hasGrammarNoteReference).toBe(true);
  });

  it("provides several exercises per exercise set", () => {
    exerciseSets.forEach((set) => {
      expect(set.exercises.length).toBeGreaterThanOrEqual(2);
    });
  });
});
