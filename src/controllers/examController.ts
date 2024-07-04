import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";

import type { SendExamViewModel } from "../models/exam/SendExamViewModel";
import type { SendExamAnswerViewModel } from "../models/exam/SendExamAnswerViewModel";
import type { BodySendExamAnswer } from "../models/exam/BodySendExamAnswer";
import { DBError } from "./DBError";
import { examService } from "../domain/examService";
import type { GetExamResult } from "../models/exam/GetExamResult";

export const examController = {
	async sendExam(req: Request, res: Response<SendExamViewModel[] | ErrorType>) {
		try {
			const exam = await examService.sendExam(req.userId || "");

			res.json(exam);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось отправить экзамен", error, res });
		}
	},

	async sendExamAnswer(
		req: RequestWithBody<BodySendExamAnswer>,
		res: Response<SendExamAnswerViewModel | ErrorType>,
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
			});
		}
	},

	async sendTrainingExamAnswer(
		req: RequestWithBody<BodySendExamAnswer>,
		res: Response<SendExamAnswerViewModel | ErrorType>,
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
			});
		}
	},

	async getExamResult(
		req: Request,
		res: Response<GetExamResult[] | ErrorType>,
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
			});
		}
	},

	async getTrainingExamResult(
		req: Request,
		res: Response<GetExamResult[] | ErrorType>,
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
			});
		}
	},

	async setAlwaysCompleteExam(
		req: RequestWithBody<{ email: string; isAlwaysComplete: boolean }>,
		res: Response<GetExamResult[] | ErrorType>,
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
			});
		}
	},
};
