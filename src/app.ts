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

app.use("/auth", getAuthRouter());
app.use("/tickets", getTicketsRouter());
app.use("/question", questionRouter());
app.use("/exam", getExamRouter());
app.use("/ticketEditor", ticketEditorRouter());
app.use("/userEditor", userEditorRouter());
