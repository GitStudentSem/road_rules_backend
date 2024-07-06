import express from "express";
import cors from "cors";

import { getAuthRouter } from "./routes/auth";
import { getTicketsRouter } from "./routes/tickets";
import { getExamRouter } from "./routes/exam";
import { ticketEditorRouter } from "./routes/ticketEditor";
import { userEditorRouter } from "./routes/userEditor";
import { questionRouter } from "./routes/question";

export const app = express();

app.use(cors());

app.use(express.json({}));

app.use((req, res, next) => {
	const path = req.path;
	if (path.includes("swagger")) return;
	console.log(`Запрос на роут ${path} с методом ${req.method}`);
	next();
});

app.use("/auth", getAuthRouter());
app.use("/tickets", getTicketsRouter());
app.use("/question", questionRouter());
app.use("/exam", getExamRouter());
app.use("/ticketEditor", ticketEditorRouter());
app.use("/userEditor", userEditorRouter());
