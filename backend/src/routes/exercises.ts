import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const router = Router();

const answerOptionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean().optional().default(false),
  imagePath: z.string().optional(),
  audioPath: z.string().optional(),
  sortOrder: z.number().optional().default(0),
});

const exerciseTypeSchema = z.enum([
  "multiple_choice",
  "picture_choice",
  "text_translation",
  "sentence_translation",
  "fill_gap",
  "transform_sentence",
  "build_question",
  "order_words",
  "match_pairs",
  "listening",
  "dictation",
]);

const createExerciseSchema = z.object({
  exerciseSetId: z.number().int(),
  type: exerciseTypeSchema,
  questionText: z.string(),
  promptText: z.string().optional(),
  correctAnswers: z.array(z.string()),
  acceptableAnswers: z.array(z.string()).optional(),
  explanation: z.string().optional(),
  grammarNoteId: z.number().int().optional(),
  imagePath: z.string().optional(),
  audioPath: z.string().optional(),
  difficulty: z.string().optional(),
  tags: z.array(z.string()).optional(),
  answerOptions: z.array(answerOptionSchema).optional(),
});

const updateExerciseSchema = createExerciseSchema.partial().omit({ answerOptions: true });

router.get("/", async (_req, res, next) => {
  try {
    const exercises = await prisma.exercise.findMany({
      include: { answerOptions: true, grammarNote: true },
    });
    res.json(exercises);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: Number(req.params.id) },
      include: { answerOptions: true, grammarNote: true },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = createExerciseSchema.parse(req.body);
    const exercise = await prisma.exercise.create({
      data: {
        exerciseSetId: payload.exerciseSetId,
        type: payload.type,
        questionText: payload.questionText,
        promptText: payload.promptText,
        correctAnswers: payload.correctAnswers,
        acceptableAnswers: payload.acceptableAnswers,
        explanation: payload.explanation,
        grammarNoteId: payload.grammarNoteId,
        imagePath: payload.imagePath,
        audioPath: payload.audioPath,
        difficulty: payload.difficulty,
        tags: payload.tags,
        answerOptions: payload.answerOptions
          ? {
              create: payload.answerOptions,
            }
          : undefined,
      },
      include: { answerOptions: true },
    });

    res.status(201).json(exercise);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const payload = updateExerciseSchema.parse(req.body);
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) {
        data[key] = value;
      }
    }
    const exercise = await prisma.exercise.update({
      where: { id: Number(req.params.id) },
      data,
      include: { answerOptions: true },
    });

    res.json(exercise);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.exercise.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
