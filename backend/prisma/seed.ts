import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedExercise = {
  type: "multiple_choice" | "fill_gap" | "sentence_translation" | "text_translation";
  questionText: string;
  promptText?: string;
  correctAnswers: string[];
  acceptableAnswers?: string[];
  explanation?: string;
  grammarNoteTitle?: string;
  difficulty?: string;
  tags: string[];
  answerOptions?: Array<{
    text: string;
    isCorrect: boolean;
  }>;
};

type SeedExerciseSet = {
  title: string;
  description: string;
  level: string;
  category: string;
  exercises: SeedExercise[];
};

export const grammarNotes = [
  {
    title: "Present Simple",
    topic: "Verb tenses",
    contentMarkdown:
      "Use the Present Simple for habits, routines and general facts. Add `-s` or `-es` for he, she and it.",
    examplesJson: [
      { example: "I work every day." },
      { example: "She drinks coffee every morning." },
      { example: "They live in Warsaw." },
    ],
    level: "A1",
  },
  {
    title: "Past Simple",
    topic: "Verb tenses",
    contentMarkdown:
      "Use the Past Simple for finished actions in the past. Regular verbs usually end in `-ed`; many common verbs are irregular.",
    examplesJson: [
      { example: "I visited London last year." },
      { example: "She went home at six." },
      { example: "We watched a film yesterday." },
    ],
    level: "A2",
  },
  {
    title: "Articles: a/an/the",
    topic: "Nouns and determiners",
    contentMarkdown:
      "Use `a` before consonant sounds, `an` before vowel sounds, and `the` when the listener knows which thing you mean.",
    examplesJson: [
      { example: "I have a bag." },
      { example: "She eats an apple." },
      { example: "The train is late." },
    ],
    level: "A1",
  },
  {
    title: "Questions with do/does/did",
    topic: "Questions and negatives",
    contentMarkdown:
      "Use `do` and `does` for Present Simple questions. Use `did` for Past Simple questions, and keep the main verb in its base form.",
    examplesJson: [
      { example: "Do you like tea?" },
      { example: "Does he work here?" },
      { example: "Did they visit Krakow?" },
    ],
    level: "A1/A2",
  },
  {
    title: "There is / There are",
    topic: "Describing places",
    contentMarkdown:
      "Use `there is` for one thing and `there are` for more than one thing. In questions, put `is` or `are` before `there`.",
    examplesJson: [
      { example: "There is a table in the kitchen." },
      { example: "There are two bedrooms." },
      { example: "Is there a bank near here?" },
    ],
    level: "A1",
  },
];

export const exerciseSets: SeedExerciseSet[] = [
  {
    title: "Basic vocabulary: home",
    description: "Rooms, furniture and simple sentences for talking about home.",
    level: "A1",
    category: "Vocabulary",
    exercises: [
      {
        type: "text_translation",
        questionText: "How do you say 'dom' in English?",
        promptText: "Provide one English word.",
        correctAnswers: ["house"],
        acceptableAnswers: ["home"],
        explanation: "`House` is a building. `Home` can mean the place where you live.",
        tags: ["home", "vocabulary"],
        difficulty: "easy",
      },
      {
        type: "multiple_choice",
        questionText: "Which word means 'kuchnia'?",
        correctAnswers: ["kitchen"],
        explanation: "`Kitchen` is the room where you cook.",
        tags: ["home", "rooms"],
        difficulty: "easy",
        answerOptions: [
          { text: "bedroom", isCorrect: false },
          { text: "kitchen", isCorrect: true },
          { text: "garden", isCorrect: false },
        ],
      },
      {
        type: "fill_gap",
        questionText: "Complete the sentence.",
        promptText: "There ____ a table in the kitchen.",
        correctAnswers: ["is"],
        explanation: "Use `there is` for one thing.",
        grammarNoteTitle: "There is / There are",
        tags: ["home", "there-is"],
        difficulty: "easy",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "W salonie jest sofa.",
        correctAnswers: ["There is a sofa in the living room."],
        acceptableAnswers: ["There is a couch in the living room.", "There is a sofa in the lounge."],
        explanation: "Use `there is` because we are talking about one sofa.",
        grammarNoteTitle: "There is / There are",
        tags: ["home", "translation"],
        difficulty: "medium",
      },
    ],
  },
  {
    title: "Basic vocabulary: travel",
    description: "Useful travel words and simple phrases for stations, tickets and hotels.",
    level: "A1/A2",
    category: "Vocabulary",
    exercises: [
      {
        type: "multiple_choice",
        questionText: "Which word means 'bilet'?",
        correctAnswers: ["ticket"],
        tags: ["travel", "vocabulary"],
        difficulty: "easy",
        answerOptions: [
          { text: "ticket", isCorrect: true },
          { text: "station", isCorrect: false },
          { text: "suitcase", isCorrect: false },
        ],
      },
      {
        type: "fill_gap",
        questionText: "Complete the travel question.",
        promptText: "Where is the train ____?",
        correctAnswers: ["station"],
        explanation: "`Train station` means a place where trains stop.",
        tags: ["travel", "places"],
        difficulty: "easy",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "Chciałbym bilet do Londynu.",
        correctAnswers: ["I would like a ticket to London."],
        acceptableAnswers: ["I'd like a ticket to London.", "I want a ticket to London."],
        explanation: "`I would like` is polite and useful when buying tickets.",
        tags: ["travel", "translation"],
        difficulty: "medium",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "Hotel jest blisko lotniska.",
        correctAnswers: ["The hotel is near the airport."],
        acceptableAnswers: ["The hotel is close to the airport."],
        explanation: "Use `the hotel` when speaking about a specific hotel.",
        grammarNoteTitle: "Articles: a/an/the",
        tags: ["travel", "articles"],
        difficulty: "medium",
      },
    ],
  },
  {
    title: "Present Simple",
    description: "Habits, routines and third-person singular endings.",
    level: "A1/A2",
    category: "Grammar",
    exercises: [
      {
        type: "multiple_choice",
        questionText: "Which sentence is correct?",
        correctAnswers: ["She drinks coffee every day."],
        explanation: "With `she`, add `-s` to the verb in Present Simple.",
        grammarNoteTitle: "Present Simple",
        tags: ["present-simple", "third-person"],
        difficulty: "easy",
        answerOptions: [
          { text: "She drink coffee every day.", isCorrect: false },
          { text: "She drinks coffee every day.", isCorrect: true },
          { text: "She drinking coffee every day.", isCorrect: false },
        ],
      },
      {
        type: "fill_gap",
        questionText: "Complete the sentence.",
        promptText: "He ____ English at school.",
        correctAnswers: ["studies"],
        explanation: "For verbs ending in consonant + `y`, change `y` to `ies` after he/she/it.",
        grammarNoteTitle: "Present Simple",
        tags: ["present-simple", "verbs"],
        difficulty: "medium",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "Oni mieszkają w Warszawie.",
        correctAnswers: ["They live in Warsaw."],
        acceptableAnswers: ["They live in Warszawa."],
        explanation: "Use the base verb after `they`.",
        grammarNoteTitle: "Present Simple",
        tags: ["present-simple", "translation"],
        difficulty: "easy",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "Moja siostra pracuje w banku.",
        correctAnswers: ["My sister works in a bank."],
        acceptableAnswers: ["My sister works at a bank."],
        explanation: "Use `works` because `my sister` is third-person singular.",
        grammarNoteTitle: "Present Simple",
        tags: ["present-simple", "jobs"],
        difficulty: "medium",
      },
    ],
  },
  {
    title: "Past Simple",
    description: "Finished actions in the past with regular and common irregular verbs.",
    level: "A2",
    category: "Grammar",
    exercises: [
      {
        type: "multiple_choice",
        questionText: "Which sentence is in the Past Simple?",
        correctAnswers: ["We visited Krakow last weekend."],
        explanation: "`Visited` is a regular Past Simple form.",
        grammarNoteTitle: "Past Simple",
        tags: ["past-simple", "regular-verbs"],
        difficulty: "easy",
        answerOptions: [
          { text: "We visit Krakow last weekend.", isCorrect: false },
          { text: "We visited Krakow last weekend.", isCorrect: true },
          { text: "We are visiting Krakow last weekend.", isCorrect: false },
        ],
      },
      {
        type: "fill_gap",
        questionText: "Complete the sentence.",
        promptText: "She ____ home at six yesterday.",
        correctAnswers: ["went"],
        explanation: "`Went` is the Past Simple form of `go`.",
        grammarNoteTitle: "Past Simple",
        tags: ["past-simple", "irregular-verbs"],
        difficulty: "medium",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "Wczoraj oglądaliśmy film.",
        correctAnswers: ["We watched a film yesterday."],
        acceptableAnswers: ["We watched a movie yesterday."],
        explanation: "`Watched` is a regular Past Simple verb.",
        grammarNoteTitle: "Past Simple",
        tags: ["past-simple", "translation"],
        difficulty: "easy",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "Kupiłem nową torbę.",
        correctAnswers: ["I bought a new bag."],
        acceptableAnswers: ["I bought a new purse."],
        explanation: "`Bought` is the Past Simple form of `buy`; use `a` before `new bag`.",
        grammarNoteTitle: "Past Simple",
        tags: ["past-simple", "articles"],
        difficulty: "medium",
      },
    ],
  },
  {
    title: "Questions and negatives",
    description: "Do, does and did in everyday questions and negative sentences.",
    level: "A1/A2",
    category: "Grammar",
    exercises: [
      {
        type: "multiple_choice",
        questionText: "Choose the correct question.",
        correctAnswers: ["Does she work here?"],
        explanation: "Use `does` with he/she/it, and keep the main verb as `work`.",
        grammarNoteTitle: "Questions with do/does/did",
        tags: ["questions", "present-simple"],
        difficulty: "medium",
        answerOptions: [
          { text: "Does she work here?", isCorrect: true },
          { text: "Do she works here?", isCorrect: false },
          { text: "Does she works here?", isCorrect: false },
        ],
      },
      {
        type: "fill_gap",
        questionText: "Complete the question.",
        promptText: "____ they visit Krakow last year?",
        correctAnswers: ["Did"],
        acceptableAnswers: ["did"],
        explanation: "Use `did` for Past Simple questions.",
        grammarNoteTitle: "Questions with do/does/did",
        tags: ["questions", "past-simple"],
        difficulty: "medium",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "Nie lubię kawy.",
        correctAnswers: ["I do not like coffee."],
        acceptableAnswers: ["I don't like coffee."],
        explanation: "Use `do not` or `don't` for Present Simple negatives with `I`.",
        grammarNoteTitle: "Questions with do/does/did",
        tags: ["negatives", "present-simple"],
        difficulty: "easy",
      },
      {
        type: "sentence_translation",
        questionText: "Translate into English.",
        promptText: "Czy on mieszka tutaj?",
        correctAnswers: ["Does he live here?"],
        acceptableAnswers: ["Does he live here"],
        explanation: "Use `does` with `he`; the main verb stays in base form.",
        grammarNoteTitle: "Questions with do/does/did",
        tags: ["questions", "translation"],
        difficulty: "medium",
      },
    ],
  },
];

const seedProfileName = "Anna";

async function clearSeedData() {
  await prisma.testSessionAnswer.deleteMany({
    where: { exercise: { exerciseSet: { isBuiltIn: true } } },
  });
  await prisma.testSession.deleteMany({
    where: {
      userProfile: {
        name: seedProfileName,
        nativeLanguage: "Polish",
        targetLanguage: "English",
      },
    },
  });
  await prisma.userExerciseProgress.deleteMany({
    where: { exercise: { exerciseSet: { isBuiltIn: true } } },
  });
  await prisma.answerOption.deleteMany({
    where: { exercise: { exerciseSet: { isBuiltIn: true } } },
  });
  await prisma.exercise.deleteMany({
    where: { exerciseSet: { isBuiltIn: true } },
  });
  await prisma.exerciseSet.deleteMany({ where: { isBuiltIn: true } });
  await prisma.grammarNote.deleteMany({
    where: { title: { in: grammarNotes.map((note) => note.title) } },
  });
  await prisma.userProfile.deleteMany({
    where: {
      name: seedProfileName,
      nativeLanguage: "Polish",
      targetLanguage: "English",
    },
  });
}

async function main() {
  await clearSeedData();

  await prisma.language.createMany({
    data: [
      { code: "en", name: "English" },
      { code: "pl", name: "Polish" },
    ],
    skipDuplicates: true,
  });

  const userProfile = await prisma.userProfile.create({
    data: {
      name: "Anna",
      nativeLanguage: "Polish",
      targetLanguage: "English",
      lastUsedAt: new Date(),
      settings: {
        create: {
          autoPlayAudio: false,
          showHintsInLearningMode: true,
          repeatWrongAnswers: true,
          learningIntensity: "medium",
          theme: "light",
        },
      },
    },
  });

  const noteEntries = await Promise.all(
    grammarNotes.map((note) =>
      prisma.grammarNote.create({
        data: {
          language: "English",
          title: note.title,
          topic: note.topic,
          contentMarkdown: note.contentMarkdown,
          examplesJson: note.examplesJson,
          level: note.level,
        },
      })
    )
  );
  const noteIdByTitle = new Map(noteEntries.map((note) => [note.title, note.id]));

  const createdExercises = [];
  for (const set of exerciseSets) {
    const exerciseSet = await prisma.exerciseSet.create({
      data: {
        title: set.title,
        description: set.description,
        targetLanguage: "English",
        nativeLanguage: "Polish",
        level: set.level,
        category: set.category,
        createdBy: userProfile.id,
        isBuiltIn: true,
        exercises: {
          create: set.exercises.map((exercise) => ({
            type: exercise.type,
            questionText: exercise.questionText,
            promptText: exercise.promptText,
            correctAnswers: exercise.correctAnswers,
            acceptableAnswers: exercise.acceptableAnswers,
            explanation: exercise.explanation,
            grammarNoteId: exercise.grammarNoteTitle ? noteIdByTitle.get(exercise.grammarNoteTitle) : undefined,
            difficulty: exercise.difficulty,
            tags: exercise.tags,
            answerOptions: exercise.answerOptions
              ? {
                  create: exercise.answerOptions.map((option, index) => ({
                    ...option,
                    sortOrder: index + 1,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: { exercises: true },
    });

    createdExercises.push(...exerciseSet.exercises);
  }

  const [firstExercise, secondExercise, thirdExercise] = createdExercises;
  if (firstExercise && secondExercise && thirdExercise) {
    await prisma.userExerciseProgress.createMany({
      data: [
        {
          userProfileId: userProfile.id,
          exerciseId: firstExercise.id,
          attempts: 1,
          correctAttempts: 0,
          wrongAttempts: 1,
          masteryLevel: 0,
          lastAnswer: "home",
          lastAnsweredAt: new Date(),
          nextReviewAt: new Date(),
          easeFactor: 2.3,
          intervalDays: 0,
        },
        {
          userProfileId: userProfile.id,
          exerciseId: secondExercise.id,
          attempts: 2,
          correctAttempts: 2,
          wrongAttempts: 0,
          masteryLevel: 2,
          lastAnswer: "kitchen",
          lastAnsweredAt: new Date(),
          nextReviewAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          easeFactor: 2.7,
          intervalDays: 4,
        },
        {
          userProfileId: userProfile.id,
          exerciseId: thirdExercise.id,
          attempts: 1,
          correctAttempts: 1,
          wrongAttempts: 0,
          masteryLevel: 1,
          lastAnswer: "is",
          lastAnsweredAt: new Date(),
          nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          easeFactor: 2.6,
          intervalDays: 2,
        },
      ],
    });

    await prisma.testSession.create({
      data: {
        userProfileId: userProfile.id,
        mode: "learning",
        finishedAt: new Date(),
        totalQuestions: 3,
        correctAnswers: 2,
        scorePercent: 67,
        answers: {
          create: [
            {
              exerciseId: firstExercise.id,
              userAnswer: "home",
              isCorrect: false,
              timeSpentSeconds: 12,
              usedHint: false,
            },
            {
              exerciseId: secondExercise.id,
              userAnswer: "kitchen",
              isCorrect: true,
              timeSpentSeconds: 8,
              usedHint: false,
            },
            {
              exerciseId: thirdExercise.id,
              userAnswer: "is",
              isCorrect: true,
              timeSpentSeconds: 10,
              usedHint: false,
            },
          ],
        },
      },
    });
  }

  console.log(
    `Seed complete: ${grammarNotes.length} grammar notes, ${exerciseSets.length} exercise sets, ${createdExercises.length} exercises.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
