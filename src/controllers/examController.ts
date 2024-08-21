import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";
import type {
	BodySetAlwaysCompleteExam,
	ViewSendExam,
} from "../types/controllers/examController";
import type { ViewSendExamAnswer } from "../types/controllers/examController";
import type { BodySendExamAnswer } from "../types/controllers/examController";
import { DBError } from "./DBError";
import { examService } from "../services/examService";
import type { ViewGetExamResult } from "../types/controllers/examController";

export const examController = {
	async sendExam(req: Request, res: Response<ViewSendExam[] | ErrorType>) {
		try {
			const exam = await examService.sendExam(req.userId || "");

			res.json(exam);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось отправить экзамен", error, res, req });
		}
	},

	async sendExamAnswer(
		req: RequestWithBody<BodySendExamAnswer>,
		res: Response<ViewSendExamAnswer | ErrorType>,
	) {
		try {
			const result = await examService.sendExamAnswer({
				userId: req.userId || "",
				ticketId: req.body.ticketId,
				questionId: req.body.questionId,
				answerId: req.body.answerId,
			});

			res.json(result);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				message: "Не удалось отправить ответ на экзаменационный вопрос",
				error,
				res,
				req,
			});
		}
	},

	async sendTrainingExamAnswer(
		req: RequestWithBody<BodySendExamAnswer>,
		res: Response<ViewSendExamAnswer | ErrorType>,
	) {
		try {
			const result = await examService.sendTrainingExamAnswer({
				userId: req.userId || "",
				ticketId: req.body.ticketId,
				questionId: req.body.questionId,
				answerId: req.body.answerId,
			});

			res.json(result);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				message: "Не удалось отправить ответ на экзаменационный вопрос",
				error,
				res,
				req,
			});
		}
	},

	async getExamResult(
		req: Request,
		res: Response<ViewGetExamResult[] | ErrorType>,
	) {
		try {
			const result = await examService.getExamResult(req.userId || "");

			res.json(result);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				message: "Не удалось получить результаты экзамена",
				error,
				res,
				req,
			});
		}
	},

	async getTrainingExamResult(
		req: Request,
		res: Response<ViewGetExamResult[] | ErrorType>,
	) {
		try {
			const result = await examService.getTrainingExamResult(req.userId || "");

			res.json(result);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				message: "Не удалось получить результаты экзамена",
				error,
				res,
				req,
			});
		}
	},

	async setAlwaysCompleteExam(
		req: RequestWithBody<BodySetAlwaysCompleteExam>,
		res: Response<ViewGetExamResult[] | ErrorType>,
	) {
		try {
			const { email, isAlwaysComplete } = req.body;
			await examService.setAlwaysCompleteExam({ email, isAlwaysComplete });

			res.sendStatus(204);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				message: "Не удалось получить результаты экзамена",
				error,
				res,
				req,
			});
		}
	},
};
