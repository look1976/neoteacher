import { describe, expect, it } from "vitest";
import { buildExerciseQueryPayload, selectExercisesForSession } from "../src/lib/sessionSelection";

describe("session selection", () => {
  const exercises = [
    { id: 1, exerciseSetId: 1 },
    { id: 2, exerciseSetId: 2 },
    { id: 3, exerciseSetId: 1 },
    { id: 4, exerciseSetId: 2 },
  ];

  it("filters exercises by exercise set", () => {
    const selected = selectExercisesForSession(exercises, { exerciseSetId: 2 });
    expect(selected.map((exercise) => exercise.id)).toEqual([2, 4]);
  });

  it("limits the number of selected exercises", () => {
    const selected = selectExercisesForSession(exercises, { limit: 2 });
    expect(selected.map((exercise) => exercise.id)).toEqual([1, 2]);
  });

  it("filters and limits in combination", () => {
    const selected = selectExercisesForSession(exercises, { exerciseSetId: 1, limit: 1 });
    expect(selected.map((exercise) => exercise.id)).toEqual([1]);
  });

  it("builds a Prisma-compatible exercise query payload", () => {
    expect(buildExerciseQueryPayload({ exerciseSetId: 3, limit: 5 })).toEqual({
      where: { exerciseSetId: 3 },
      take: 5,
    });
  });

  it("builds an empty payload when no selection options are provided", () => {
    expect(buildExerciseQueryPayload({})).toEqual({});
  });
});
