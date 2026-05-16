export interface UserProfile {
  id: number;
  name: string;
  nativeLanguage: string;
  targetLanguage: string;
  createdAt: string;
  lastUsedAt?: string | null;
}

export interface Exercise {
  id: number;
  type: string;
  questionText: string;
  promptText?: string | null;
  correctAnswers: any;
  acceptableAnswers?: any | null;
  explanation?: string | null;
  grammarNoteId?: number | null;
  imagePath?: string | null;
  audioPath?: string | null;
  difficulty?: string | null;
  tags?: any | null;
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
