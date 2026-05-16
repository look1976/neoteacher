export type ProgressSnapshot = {
  attempts: number;
  correctAttempts: number;
  wrongAttempts: number;
  masteryLevel: number;
  easeFactor: number;
  intervalDays: number;
};

export type ProgressUpdateInput = {
  existingProgress?: ProgressSnapshot | null;
  isCorrect: boolean;
  userAnswer: string;
  answeredAt: Date;
};

export type ProgressUpdate = {
  attempts: number;
  correctAttempts: number;
  wrongAttempts: number;
  masteryLevel: number;
  easeFactor: number;
  intervalDays: number;
  lastAnswer: string;
  lastAnsweredAt: Date;
  nextReviewAt: Date;
};

const REVIEW_INTERVALS_BY_MASTERY = [1, 2, 4, 7, 14, 30] as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function getIntervalDaysForMastery(masteryLevel: number) {
  const safeMasteryLevel = clamp(Math.trunc(masteryLevel), 0, REVIEW_INTERVALS_BY_MASTERY.length - 1);
  return REVIEW_INTERVALS_BY_MASTERY[safeMasteryLevel];
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function buildProgressUpdate({
  existingProgress,
  isCorrect,
  userAnswer,
  answeredAt,
}: ProgressUpdateInput): ProgressUpdate {
  const previousMastery = existingProgress?.masteryLevel ?? 0;
  const masteryLevel = isCorrect ? clamp(previousMastery + 1, 0, 5) : clamp(previousMastery - 1, 0, 5);
  const intervalDays = isCorrect ? getIntervalDaysForMastery(masteryLevel) : 0;
  const previousEaseFactor = existingProgress?.easeFactor ?? 2.5;
  const easeFactor = isCorrect ? clamp(previousEaseFactor + 0.1, 1.3, 3) : clamp(previousEaseFactor - 0.2, 1.3, 3);

  return {
    attempts: (existingProgress?.attempts ?? 0) + 1,
    correctAttempts: (existingProgress?.correctAttempts ?? 0) + (isCorrect ? 1 : 0),
    wrongAttempts: (existingProgress?.wrongAttempts ?? 0) + (isCorrect ? 0 : 1),
    masteryLevel,
    easeFactor,
    intervalDays,
    lastAnswer: userAnswer,
    lastAnsweredAt: answeredAt,
    nextReviewAt: isCorrect ? addDays(answeredAt, intervalDays) : answeredAt,
  };
}
