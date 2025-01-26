import express from "express";
import cors from "cors";

import { getAuthRouter } from "./routes/auth";
import { getTicketsRouter } from "./routes/tickets";
import { getExamRouter } from "./routes/exam";
import { ticketEditorRouter } from "./routes/ticketEditor";
import { userEditorRouter } from "./routes/userEditor";
import { logRoutes } from "./assets/logRoutes";
import { ticketCollection } from "./repositories/db";

export const app = express();

app.use(cors());

app.use(express.json({}));

app.use(logRoutes);

app.use("/api/auth", getAuthRouter());
app.use("/api/tickets", getTicketsRouter());
app.use("/api/exam", getExamRouter());
app.use("/api/ticketEditor", ticketEditorRouter());
app.use("/api/userEditor", userEditorRouter());
app.use("/test", async () => {
	const result = await ticketCollection
		.aggregate([
			{ $match: { ticketId: "1737832002257" } },
			{ $unwind: "$questions" },
			{ $project: { questionId: "$questions.questionId" } },
		])
		.toArray();
	const result2 = result.map((question) => question.questionId);
	console.log("result", result2);
});
