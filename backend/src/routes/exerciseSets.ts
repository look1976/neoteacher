import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const router = Router();

const exerciseSetCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  nativeLanguage: z.string().min(1),
  targetLanguage: z.string().min(1),
  level: z.string().optional(),
  category: z.string().optional(),
  createdBy: z.number().int().optional(),
  isBuiltIn: z.boolean().optional().default(false),
});

const exerciseSetUpdateSchema = exerciseSetCreateSchema.partial();

router.get("/", async (_req, res, next) => {
  try {
    const sets = await prisma.exerciseSet.findMany({
      include: { exercises: { include: { answerOptions: true } } },
    });
    res.json(sets);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const set = await prisma.exerciseSet.findUnique({
      where: { id: Number(req.params.id) },
      include: { exercises: { include: { answerOptions: true } } },
    });

    if (!set) {
      return res.status(404).json({ error: "Exercise set not found" });
    }

    res.json(set);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = exerciseSetCreateSchema.parse(req.body);
    const exerciseSet = await prisma.exerciseSet.create({
      data: payload,
    });
    res.status(201).json(exerciseSet);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const payload = exerciseSetUpdateSchema.parse(req.body);
    const exerciseSet = await prisma.exerciseSet.update({
      where: { id: Number(req.params.id) },
      data: payload,
    });
    res.json(exerciseSet);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.exerciseSet.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
