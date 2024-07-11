import express from "express";
import cors from "cors";

import { getAuthRouter } from "./routes/auth";
import { getTicketsRouter } from "./routes/tickets";
import { getExamRouter } from "./routes/exam";
import { ticketEditorRouter } from "./routes/ticketEditor";
import { userEditorRouter } from "./routes/userEditor";
import { questionRouter } from "./routes/question";
import { logRoutes } from "./assets/logRoutes";

export const app = express();

app.use(cors());

app.use(express.json({}));

app.use(logRoutes);

app.use("/api/auth", getAuthRouter());
app.use("/api/tickets", getTicketsRouter());
app.use("/api/question", questionRouter());
app.use("/api/exam", getExamRouter());
app.use("/api/ticketEditor", ticketEditorRouter());
app.use("/api/userEditor", userEditorRouter());
