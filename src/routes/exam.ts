import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";

import * as examController from "../controllers/examController";

export const getExamRouter = () => {
	const router = express.Router();

	router.get("/", checkAuth, examController.sendExam);
	router.post(
		"/:ticketNumber",
		checkAuth,
		answerValidation,
		examController.sendExamResult,
	);

	return router;
};
