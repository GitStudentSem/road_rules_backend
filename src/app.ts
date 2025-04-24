import express from "express";
import cors from "cors";

import { getAuthRouter } from "./routes/auth";
import { getTicketsRouter } from "./routes/tickets";
import { getExamRouter } from "./routes/exam";
import { ticketEditorRouter } from "./routes/ticketEditor";
import { userEditorRouter } from "./routes/userEditor";
import { logRoutes } from "./assets/logRoutes";
import { userCollection } from "./repositories/db";
import multer from "multer";
import AWS from "aws-sdk";
import { commentsRouter } from "./routes/comments";

export const app = express();
export const upload = multer({ storage: multer.memoryStorage() });
export const s3 = new AWS.S3({
	endpoint: process.env.ENTRY_POINT_FOR_S3 || "",
	accessKeyId: process.env.ACCESS_KEY_ID_FOR_S3 || "",
	secretAccessKey: process.env.SECRET_ACCESS_KEY_FOR_S3 || "",
	// s3ForcePathStyle: true, // Включи это, если требуется
	signatureVersion: "v4",
});
app.use(cors());

app.use(express.json({}));

app.use(logRoutes);

app.use("/api/auth", getAuthRouter());
app.use("/api/tickets", getTicketsRouter());
app.use("/api/exam", getExamRouter());
app.use("/api/ticketEditor", ticketEditorRouter());
app.use("/api/userEditor", userEditorRouter());
app.use("/api/comments", commentsRouter());
// app.use("/api/devTest", devTestRouter());
app.get("/api/devTest", async (req, res) => {
	console.log("/api/devTest");

	res.status(200);
});
