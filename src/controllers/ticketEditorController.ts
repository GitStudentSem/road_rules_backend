import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";
import { ticketEditorService } from "../services/ticketEditorService";

import type {
	BodyGetQuestionsInTicket,
	ViewCreateTicket,
	BodyCreateQuestion,
	ViewGetQuestionsInTicket,
	BodyEditQuestion,
	BodyDeleteTicket,
	BodyDeleteQuestion,
} from "../types/controllers/ticketEditorController";

export const ticketEditorController = {
	async sendTickets(req: Request, res: Response<string[] | ErrorType>) {
		try {
			const tickets = await ticketEditorService.sendTickets(req.userId || "");

			res.json(tickets);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось отправить билеты", error, res, req });
		}
	},

	async createTicket(
		req: Request,
		res: Response<ViewCreateTicket | ErrorType>,
	) {
		try {
			const ticketId = await ticketEditorService.createTicket(req.userId || "");
			res.json({ ticketId });
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось создать билет", error, res, req });
		}
	},

	async getQuestionsInTicket(
		req: RequestWithBody<BodyGetQuestionsInTicket>,
		res: Response<ViewGetQuestionsInTicket[] | ErrorType>,
	) {
		try {
			const { ticketId } = req.body;
			const questions = await ticketEditorService.getQuestionsInTicket(
				ticketId,
				req.userId || "",
			);
			res.json(questions);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				message: "Не удалось получить вопросы в билете",
				error,
				res,
				req,
			});
		}
	},

	async createQuestion(
		req: RequestWithBody<BodyCreateQuestion>,
		res: Response<ErrorType>,
	) {
		try {
			const img = req.file?.buffer;
			const { question, help, answers, ticketId, correctAnswer } = req.body;

			await ticketEditorService.createQuestion({
				img,
				ticketId,
				question,
				help: help || "",
				correctAnswer: Number(correctAnswer),
				answers,
				userId: req.userId || "",
			});

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось создать вопрос", error, res, req });
		}
	},

	async editQuestion(
		req: RequestWithBody<BodyEditQuestion>,
		res: Response<ErrorType>,
	) {
		try {
			const img = req.file?.buffer;
			const { question, help, answers, ticketId, questionId, correctAnswer } =
				req.body;
			await ticketEditorService.editQuestion({
				img,
				ticketId,
				questionId,
				question,
				help: help || "",
				correctAnswer: Number(correctAnswer),
				answers,
				userId: req.userId || "",
			});

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось изменить вопрос", error, res, req });
		}
	},

	async deleteTicket(
		req: RequestWithBody<BodyDeleteTicket>,
		res: Response<ErrorType>,
	) {
		try {
			const { ticketId } = req.body;

			await ticketEditorService.deleteTicket(ticketId, req.userId || "");

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось удалить билет", error, res, req });
		}
	},

	async deleteQuestion(
		req: RequestWithBody<BodyDeleteQuestion>,
		res: Response<ErrorType>,
	) {
		try {
			const { ticketId, questionId } = req.body;

			await ticketEditorService.deleteQuestion({
				ticketId,
				questionId,
				userId: req.userId || "",
			});

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось удалить вопрос", error, res, req });
		}
	},
};
