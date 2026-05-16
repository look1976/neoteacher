import { describe, expect, it } from "vitest";
import { buildProgressUpdate, getIntervalDaysForMastery } from "../src/lib/progress";

describe("progress spaced repetition", () => {
  const answeredAt = new Date("2026-05-16T10:00:00.000Z");

  it.each([
    [0, 1],
    [1, 2],
    [2, 4],
    [3, 7],
    [4, 14],
    [5, 30],
  ])("maps mastery %i to %i review days", (masteryLevel, expectedDays) => {
    expect(getIntervalDaysForMastery(masteryLevel)).toBe(expectedDays);
  });

  it("increases mastery, attempts, correct attempts, ease, and next review after a correct answer", () => {
    const update = buildProgressUpdate({
      existingProgress: {
        attempts: 2,
        correctAttempts: 1,
        wrongAttempts: 1,
        masteryLevel: 2,
        easeFactor: 2.5,
        intervalDays: 4,
      },
      isCorrect: true,
      userAnswer: "She drinks coffee every day",
      answeredAt,
    });

    expect(update.attempts).toBe(3);
    expect(update.correctAttempts).toBe(2);
    expect(update.wrongAttempts).toBe(1);
    expect(update.masteryLevel).toBe(3);
    expect(update.intervalDays).toBe(7);
    expect(update.easeFactor).toBeCloseTo(2.6);
    expect(update.nextReviewAt.toISOString()).toBe("2026-05-23T10:00:00.000Z");
  });

  it("does not increase mastery above 5", () => {
    const update = buildProgressUpdate({
      existingProgress: {
        attempts: 9,
        correctAttempts: 9,
        wrongAttempts: 0,
        masteryLevel: 5,
        easeFactor: 3,
        intervalDays: 30,
      },
      isCorrect: true,
      userAnswer: "house",
      answeredAt,
    });

    expect(update.masteryLevel).toBe(5);
    expect(update.intervalDays).toBe(30);
    expect(update.easeFactor).toBe(3);
  });

  it("decreases mastery, increments wrong attempts, and makes a wrong answer due immediately", () => {
    const update = buildProgressUpdate({
      existingProgress: {
        attempts: 4,
        correctAttempts: 3,
        wrongAttempts: 1,
        masteryLevel: 2,
        easeFactor: 2.4,
        intervalDays: 4,
      },
      isCorrect: false,
      userAnswer: "drink",
      answeredAt,
    });

    expect(update.attempts).toBe(5);
    expect(update.correctAttempts).toBe(3);
    expect(update.wrongAttempts).toBe(2);
    expect(update.masteryLevel).toBe(1);
    expect(update.intervalDays).toBe(0);
    expect(update.easeFactor).toBeCloseTo(2.2);
    expect(update.nextReviewAt).toEqual(answeredAt);
  });

  it("does not decrease mastery or ease below minimums", () => {
    const update = buildProgressUpdate({
      existingProgress: {
        attempts: 1,
        correctAttempts: 0,
        wrongAttempts: 1,
        masteryLevel: 0,
        easeFactor: 1.3,
        intervalDays: 0,
      },
      isCorrect: false,
      userAnswer: "wrong",
      answeredAt,
    });

    expect(update.masteryLevel).toBe(0);
    expect(update.easeFactor).toBe(1.3);
  });
});
