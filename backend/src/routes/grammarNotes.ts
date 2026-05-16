import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const notes = await prisma.grammarNote.findMany();
    res.json(notes);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const note = await prisma.grammarNote.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!note) {
      return res.status(404).json({ error: "Grammar note not found" });
    }

    res.json(note);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { language, title, topic, contentMarkdown, examplesJson, level } = req.body;

    const note = await prisma.grammarNote.create({
      data: {
        language,
        title,
        topic,
        contentMarkdown,
        examplesJson,
        level,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    return next(error);
  }
});

export default router;
