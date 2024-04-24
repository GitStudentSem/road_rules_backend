import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";

import * as taskController from "../controllers/taskController";

export const getExamRouter = () => {
	const router = express.Router();

	router.get("/", checkAuth, taskController.sendExam);
	router.post(
		"/:ticketNumber",
		checkAuth,
		answerValidation,
		taskController.sendExamTicketResult,
	);

	return router;
};
