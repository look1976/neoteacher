export interface UserProfile {
  id: number;
  name: string;
  nativeLanguage: string;
  targetLanguage: string;
  createdAt: string;
  lastUsedAt?: string | null;
  settings?: Settings | null;
}

export interface Settings {
  id: number;
  userProfileId: number;
  autoPlayAudio: boolean;
  showHintsInLearningMode: boolean;
  repeatWrongAnswers: boolean;
  learningIntensity?: string | null;
  theme?: string | null;
  updatedAt: string;
}

export interface AnswerOption {
  id: number;
  exerciseId: number;
  text: string;
  isCorrect: boolean;
  imagePath?: string | null;
  audioPath?: string | null;
  sortOrder: number;
}

export interface Exercise {
  id: number;
  exerciseSetId: number;
  type: string;
  questionText: string;
  promptText?: string | null;
  correctAnswers?: unknown;
  acceptableAnswers?: unknown | null;
  explanation?: string | null;
  grammarNoteId?: number | null;
  imagePath?: string | null;
  audioPath?: string | null;
  difficulty?: string | null;
  tags?: unknown | null;
  answerOptions?: AnswerOption[];
}

export interface GrammarNote {
  id: number;
  language: string;
  title: string;
  topic?: string | null;
  contentMarkdown: string;
  examplesJson?: unknown | null;
  level?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseSet {
  id: number;
  title: string;
  description?: string | null;
  targetLanguage: string;
  nativeLanguage: string;
  level?: string | null;
  category?: string | null;
  createdBy?: number | null;
  isBuiltIn: boolean;
  createdAt: string;
  updatedAt: string;
  exercises: Exercise[];
}

export interface UserExerciseProgress {
  id: number;
  userProfileId: number;
  exerciseId: number;
  attempts: number;
  correctAttempts: number;
  wrongAttempts: number;
  masteryLevel: number;
  lastAnswer?: string | null;
  lastAnsweredAt?: string | null;
  nextReviewAt?: string | null;
  easeFactor: number;
  intervalDays: number;
  updatedAt: string;
  exercise?: Exercise;
}

export interface LearningSessionResponse {
  sessionId: number;
  mode: "learning" | "test" | "review";
  exercises: Exercise[];
}

export interface AnswerCheckResponse {
  isCorrect: boolean;
  normalizedUserAnswer: string;
  matchedAnswer: string | null;
  score: number;
  feedback: string;
  almostCorrect: boolean;
  sessionId: number;
  exerciseId: number;
  explanation?: string | null;
  correctAnswers?: unknown;
  acceptableAnswers?: unknown | null;
}

export interface SessionAnswer {
  id: number;
  testSessionId: number;
  exerciseId: number;
  userAnswer?: string | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  usedHint: boolean;
  answeredAt: string;
}

export interface SessionReport {
  id: number;
  userProfileId: number;
  mode: "learning" | "test" | "review";
  startedAt: string;
  finishedAt?: string | null;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  answers: SessionAnswer[];
}
