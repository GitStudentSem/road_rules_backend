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
	const now = new Date();

	const year = now.getFullYear();
	const month = `0${now.getMonth() + 1}`.slice(-2);
	const day = `0${now.getDate()}`.slice(-2);
	const hours = `0${now.getHours()}`.slice(-2);
	const minutes = `0${now.getMinutes()}`.slice(-2);

	if (path.includes("swagger")) return next();
	console.log(
		`Запрос на роут ${path} с методом ${req.method} ${day}/${month}/${year} в ${hours}:${minutes}`,
	);

	next();
});

app.use("/auth", getAuthRouter());
app.use("/tickets", getTicketsRouter());
app.use("/question", questionRouter());
app.use("/exam", getExamRouter());
app.use("/ticketEditor", ticketEditorRouter());
app.use("/userEditor", userEditorRouter());
