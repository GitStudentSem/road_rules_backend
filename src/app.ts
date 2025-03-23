import express from "express";
import cors from "cors";

import { getAuthRouter } from "./routes/auth";
import { getTicketsRouter } from "./routes/tickets";
import { getExamRouter } from "./routes/exam";
import { ticketEditorRouter } from "./routes/ticketEditor";
import { userEditorRouter } from "./routes/userEditor";
import { logRoutes } from "./assets/logRoutes";
import { userCollection } from "./repositories/db";

export const app = express();

app.use(cors());

app.use(express.json({}));

app.use(logRoutes);

app.use("/api/auth", getAuthRouter());
app.use("/api/tickets", getTicketsRouter());
app.use("/api/exam", getExamRouter());
app.use("/api/ticketEditor", ticketEditorRouter());
app.use("/api/userEditor", userEditorRouter());

// app.use("/api/devTest", devTestRouter());
app.get("/api/devTest", async (req, res) => {
	console.log("/api/devTest");

	await userCollection.updateMany(
		{}, // Фильтр: пустой объект означает "все документы"
		{ $set: { isBannedForChat: false } }, // Обновление: добавление нового поля
	);
	res.status(200);
});
