import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";
import * as taskController from "../controllers/ticketsController";

export const getTicketsRouter = () => {
	const router = express.Router();

	router.get("/count", checkAuth, taskController.sendTicketsCount);

	router.get("/:ticketNumber", checkAuth, taskController.sendTicket);

	router.post(
		"/:ticketNumber",
		checkAuth,
		answerValidation,
		taskController.sendTicketResult,
	);

	return router;
};
