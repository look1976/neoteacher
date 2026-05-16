export type AnswerCheckResult = {
  isCorrect: boolean;
  normalizedUserAnswer: string;
  matchedAnswer: string | null;
  score: number;
  feedback: string;
  almostCorrect: boolean;
};

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[“”„«»„]/g, '"')
    .replace(/[‘’´`]/g, "'")
    .replace(/[^\p{L}\p{N}' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function generateOptionalVariants(value: string): string[] {
  const match = value.match(/\[(.+?)\]/);
  if (!match) {
    return [value];
  }

  const before = value.slice(0, match.index);
  const after = value.slice((match.index ?? 0) + match[0].length);
  const without = `${before}${after}`.trim();
  const withOptional = `${before}${match[1]}${after}`.trim();

  return [...generateOptionalVariants(without), ...generateOptionalVariants(withOptional)];
}

function generateAlternativeVariants(value: string): string[] {
  const segments = value.split(/\s+/);
  const results: string[][] = [[]];

  for (const segment of segments) {
    if (segment.includes("/")) {
      const options = segment.split("/");
      const nextResults: string[][] = [];
      for (const existing of results) {
        for (const option of options) {
          nextResults.push([...existing, option]);
        }
      }
      results.splice(0, results.length, ...nextResults);
    } else {
      for (const existing of results) {
        existing.push(segment);
      }
    }
  }

  return results.map((parts) => parts.join(" "));
}

function expandAnswerVariants(answer: string): string[] {
  const optionalExpanded = generateOptionalVariants(answer);
  const variants = new Set<string>();

  for (const variant of optionalExpanded) {
    for (const alt of generateAlternativeVariants(variant)) {
      variants.add(alt);
    }
  }

  return [...variants];
}

function normalizeAnswerArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string").map((item) => item as string);
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i += 1) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j += 1) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function isAlmostCorrect(answer: string, candidate: string): boolean {
  const normalizedAnswer = answer.replace(/[^a-z0-9 ]+/g, "");
  const normalizedCandidate = candidate.replace(/[^a-z0-9 ]+/g, "");
  const distance = levenshtein(normalizedAnswer, normalizedCandidate);
  const maxDistance = Math.max(1, Math.floor(Math.min(normalizedAnswer.length, normalizedCandidate.length) * 0.2));
  return distance > 0 && distance <= maxDistance;
}

export function checkAnswer(userAnswer: string, exercise: { correctAnswers: unknown; acceptableAnswers?: unknown }): AnswerCheckResult {
  const normalizedUserAnswer = normalizeText(userAnswer);
  const correctValues = normalizeAnswerArray(exercise.correctAnswers);
  const acceptableValues = normalizeAnswerArray(exercise.acceptableAnswers);
  const candidates = [...correctValues, ...acceptableValues].flatMap(expandAnswerVariants).map(normalizeText);

  const uniqueCandidates = [...new Set(candidates.filter(Boolean))];
  const matchedAnswer = uniqueCandidates.find((candidate) => candidate === normalizedUserAnswer) ?? null;
  const isCorrect = matchedAnswer !== null;
  const almostCorrect = !isCorrect && uniqueCandidates.some((candidate) => isAlmostCorrect(normalizedUserAnswer, candidate));

  if (isCorrect) {
    return {
      isCorrect: true,
      normalizedUserAnswer,
      matchedAnswer,
      score: 1,
      feedback: "Correct",
      almostCorrect: false,
    };
  }

  if (almostCorrect) {
    return {
      isCorrect: false,
      normalizedUserAnswer,
      matchedAnswer: null,
      score: 0.5,
      feedback: "Almost correct, check your spelling.",
      almostCorrect: true,
    };
  }

  return {
    isCorrect: false,
    normalizedUserAnswer,
    matchedAnswer: null,
    score: 0,
    feedback: "Incorrect",
    almostCorrect: false,
  };
}
