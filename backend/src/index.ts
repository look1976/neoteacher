import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import {
  healthRouter,
  profilesRouter,
  exerciseSetsRouter,
  grammarNotesRouter,
  exercisesRouter,
  sessionsRouter,
} from "./routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());
app.use("/health", healthRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/exercise-sets", exerciseSetsRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/grammar-notes", grammarNotesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`NeoTeacher backend running on http://localhost:${port}`);
});
