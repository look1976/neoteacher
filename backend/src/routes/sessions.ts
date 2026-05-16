import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { checkAnswer } from "../lib/checkAnswer";

const router = Router();

const startSessionSchema = z.object({
  userProfileId: z.number().int(),
  exerciseSetId: z.number().int().optional(),
  mode: z.enum(["learning", "test", "review"]).optional().default("learning"),
  limit: z.number().int().min(1).max(50).optional(),
});

const answerSchema = z.object({
  exerciseId: z.number().int(),
  userAnswer: z.string(),
  timeSpentSeconds: z.number().int().min(0).optional().default(0),
  usedHint: z.boolean().optional().default(false),
});

function sanitizeExercise(exercise: any) {
  return {
    id: exercise.id,
    exerciseSetId: exercise.exerciseSetId,
    type: exercise.type,
    questionText: exercise.questionText,
    promptText: exercise.promptText,
    imagePath: exercise.imagePath,
    audioPath: exercise.audioPath,
    difficulty: exercise.difficulty,
    tags: exercise.tags,
    answerOptions: exercise.answerOptions,
    grammarNoteId: exercise.grammarNoteId,
  };
}

router.post("/learning/start", async (req, res, next) => {
  try {
    const payload = startSessionSchema.parse(req.body);
    const profile = await prisma.userProfile.findUnique({
      where: { id: payload.userProfileId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const exerciseQuery = payload.exerciseSetId
      ? prisma.exercise.findMany({
          where: { exerciseSetId: payload.exerciseSetId },
          include: { answerOptions: true },
          take: payload.limit ?? undefined,
        })
      : prisma.exercise.findMany({
          include: { answerOptions: true },
          take: payload.limit ?? undefined,
        });

    const exercises = await exerciseQuery;
    if (exercises.length === 0) {
      return res.status(404).json({ error: "No exercises found for this session." });
    }

    const session = await prisma.testSession.create({
      data: {
        userProfileId: payload.userProfileId,
        mode: payload.mode,
      },
    });

    res.status(201).json({
      sessionId: session.id,
      mode: session.mode,
      exercises: exercises.map(sanitizeExercise),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/answer", async (req, res, next) => {
  try {
    const payload = answerSchema.parse(req.body);
    const sessionId = Number(req.params.id);
    const session = await prisma.testSession.findUnique({ where: { id: sessionId } });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const exercise = await prisma.exercise.findUnique({ where: { id: payload.exerciseId } });
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const result = checkAnswer(payload.userAnswer, {
      correctAnswers: exercise.correctAnswers,
      acceptableAnswers: exercise.acceptableAnswers,
    });

    await prisma.testSessionAnswer.create({
      data: {
        testSessionId: sessionId,
        exerciseId: payload.exerciseId,
        userAnswer: payload.userAnswer,
        isCorrect: result.isCorrect,
        timeSpentSeconds: payload.timeSpentSeconds,
        usedHint: payload.usedHint,
      },
    });

    const progressEntry = await prisma.userExerciseProgress.upsert({
      where: {
        userProfileId_exerciseId: {
          userProfileId: session.userProfileId,
          exerciseId: payload.exerciseId,
        },
      },
      create: {
        userProfileId: session.userProfileId,
        exerciseId: payload.exerciseId,
        attempts: 1,
        correctAttempts: result.isCorrect ? 1 : 0,
        wrongAttempts: result.isCorrect ? 0 : 1,
        masteryLevel: result.isCorrect ? 1 : 0,
        lastAnswer: payload.userAnswer,
        lastAnsweredAt: new Date(),
        nextReviewAt: result.isCorrect ? new Date(Date.now() + 24 * 60 * 60 * 1000) : new Date(),
      },
      update: {
        attempts: { increment: 1 },
        correctAttempts: { increment: result.isCorrect ? 1 : 0 },
        wrongAttempts: { increment: result.isCorrect ? 0 : 1 },
        lastAnswer: payload.userAnswer,
        lastAnsweredAt: new Date(),
        masteryLevel: {
          increment: result.isCorrect ? 1 : -1,
        },
        nextReviewAt: result.isCorrect
          ? new Date(Date.now() + 24 * 60 * 60 * 1000)
          : new Date(),
      },
    });

    await prisma.userExerciseProgress.update({
      where: { id: progressEntry.id },
      data: {
        masteryLevel: Math.max(0, Math.min(5, progressEntry.masteryLevel)),
      },
    });

    res.json({
      ...result,
      sessionId: session.id,
      exerciseId: payload.exerciseId,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/finish", async (req, res, next) => {
  try {
    const sessionId = Number(req.params.id);
    const answers = await prisma.testSessionAnswer.findMany({
      where: { testSessionId: sessionId },
    });

    if (answers.length === 0) {
      return res.status(400).json({ error: "No answers recorded for this session." });
    }

    const correctAnswers = answers.filter((item) => item.isCorrect).length;
    const totalQuestions = answers.length;
    const scorePercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const session = await prisma.testSession.update({
      where: { id: sessionId },
      data: {
        finishedAt: new Date(),
        totalQuestions,
        correctAnswers,
        scorePercent,
      },
      include: { answers: true },
    });

    res.json(session);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/report", async (req, res, next) => {
  try {
    const sessionId = Number(req.params.id);
    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
      include: { answers: true },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
});

export default router;
