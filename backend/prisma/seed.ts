import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.testSessionAnswer.deleteMany();
  await prisma.testSession.deleteMany();
  await prisma.userExerciseProgress.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.exerciseSet.deleteMany();
  await prisma.grammarNote.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.language.deleteMany();

  const english = await prisma.language.create({
    data: { code: "en", name: "English" },
  });

  const polish = await prisma.language.create({
    data: { code: "pl", name: "Polish" },
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

  const grammarNote = await prisma.grammarNote.create({
    data: {
      language: "English",
      title: "Present Simple",
      topic: "Verb tenses",
      contentMarkdown: "Use the Present Simple for habits and routines.",
      examplesJson: [
        { example: "I work every day." },
        { example: "She doesn\'t like coffee." },
      ],
      level: "beginner",
    },
  });

  const exerciseSet = await prisma.exerciseSet.create({
    data: {
      title: "Everyday English",
      description: "Basic vocabulary and sentence practice for beginner learners.",
      targetLanguage: "English",
      nativeLanguage: "Polish",
      level: "A1",
      category: "Vocabulary",
      createdBy: userProfile.id,
      isBuiltIn: false,
      exercises: {
        create: [
          {
            type: "text_translation",
            questionText: "How do you say 'dom' in English?",
            promptText: "Provide a short translation.",
            correctAnswers: ["house"],
            acceptableAnswers: ["home"],
            explanation: "The Polish word 'dom' means 'house' in English.",
            grammarNoteId: grammarNote.id,
            tags: ["vocabulary", "home"],
          },
          {
            type: "multiple_choice",
            questionText: "Which sentence is correct?",
            promptText: "Choose the sentence in Present Simple.",
            correctAnswers: ["I drink coffee every morning."],
            acceptableAnswers: ["I drink coffee every day."],
            explanation: "Use the base verb form for third-person singular subjects.",
            grammarNoteId: grammarNote.id,
            tags: ["grammar", "present_simple"],
            answerOptions: {
              create: [
                { text: "I drink coffee every morning.", isCorrect: true, sortOrder: 1 },
                { text: "I drinks coffee every morning.", isCorrect: false, sortOrder: 2 },
                { text: "I am drink coffee every morning.", isCorrect: false, sortOrder: 3 },
              ],
            },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  await prisma.userExerciseProgress.create({
    data: {
      userProfileId: userProfile.id,
      exerciseId: exerciseSet.exercises[0].id,
      attempts: 1,
      correctAttempts: 0,
      wrongAttempts: 1,
      masteryLevel: 1,
      lastAnswer: "home",
      easeFactor: 2.5,
      intervalDays: 1,
    },
  });

  await prisma.testSession.create({
    data: {
      userProfileId: userProfile.id,
      mode: "learning",
      totalQuestions: 2,
      correctAnswers: 1,
      scorePercent: 50,
      answers: {
        create: [
          {
            exerciseId: exerciseSet.exercises[0].id,
            userAnswer: "home",
            isCorrect: false,
            timeSpentSeconds: 12,
            usedHint: false,
          },
          {
            exerciseId: exerciseSet.exercises[1].id,
            userAnswer: "I drink coffee every morning.",
            isCorrect: true,
            timeSpentSeconds: 18,
            usedHint: false,
          },
        ],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
