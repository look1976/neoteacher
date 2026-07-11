export type SessionSelectionOptions = {
  exerciseSetId?: number;
  limit?: number;
};

export type SessionExerciseQuery = {
  where?: {
    exerciseSetId: number;
  };
  take?: number;
};

export function buildExerciseQueryPayload(options: SessionSelectionOptions): SessionExerciseQuery {
  const query: SessionExerciseQuery = {};

  if (options.exerciseSetId !== undefined) {
    query.where = { exerciseSetId: options.exerciseSetId };
  }

  if (options.limit !== undefined) {
    query.take = options.limit;
  }

  return query;
}

export function selectExercisesForSession<T extends { exerciseSetId: number }>(
  exercises: T[],
  options: SessionSelectionOptions
): T[] {
  const filtered = options.exerciseSetId !== undefined
    ? exercises.filter((exercise) => exercise.exerciseSetId === options.exerciseSetId)
    : [...exercises];

  return options.limit !== undefined ? filtered.slice(0, options.limit) : filtered;
}
