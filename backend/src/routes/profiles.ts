import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const router = Router();

const profileCreateSchema = z.object({
  name: z.string().min(1),
  nativeLanguage: z.string().min(1),
  targetLanguage: z.string().min(1),
});

const profileUpdateSchema = profileCreateSchema.partial();

router.get("/", async (_req, res, next) => {
  try {
    const profiles = await prisma.userProfile.findMany({ include: { settings: true } });
    res.json(profiles);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/progress", async (req, res, next) => {
  try {
    const userProfileId = Number(req.params.id);
    const progress = await prisma.userExerciseProgress.findMany({
      where: { userProfileId },
      include: { exercise: true },
    });
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/reviews", async (req, res, next) => {
  try {
    const userProfileId = Number(req.params.id);
    const reviews = await prisma.userExerciseProgress.findMany({
      where: {
        userProfileId,
        nextReviewAt: { lte: new Date() },
      },
      include: { exercise: true },
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/reviews/start", async (req, res, next) => {
  try {
    const userProfileId = Number(req.params.id);
    const dueReviews = await prisma.userExerciseProgress.findMany({
      where: {
        userProfileId,
        nextReviewAt: { lte: new Date() },
      },
      include: { exercise: { include: { answerOptions: true } } },
    });

    if (dueReviews.length === 0) {
      return res.status(404).json({ error: "No due reviews available." });
    }

    const session = await prisma.testSession.create({
      data: {
        userProfileId,
        mode: "review",
      },
    });

    res.status(201).json({
      sessionId: session.id,
      exercises: dueReviews.map((review) => ({
        ...review.exercise,
        correctAnswers: undefined,
        acceptableAnswers: undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { id: Number(req.params.id) },
      include: { settings: true },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = profileCreateSchema.parse(req.body);

    const profile = await prisma.userProfile.create({
      data: {
        name: payload.name,
        nativeLanguage: payload.nativeLanguage,
        targetLanguage: payload.targetLanguage,
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
      include: { settings: true },
    });

    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const payload = profileUpdateSchema.parse(req.body);
    const profile = await prisma.userProfile.update({
      where: { id: Number(req.params.id) },
      data: payload,
      include: { settings: true },
    });
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.userProfile.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
