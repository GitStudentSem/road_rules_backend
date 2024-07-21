import type { Response } from "express";
import { sendError } from "../assets/requestAssets";
import type { ErrorType, RequestWithBody } from "../types";
import { DBError } from "./DBError";
import { questionService } from "../services/questionService";
import type { CreateQuestionDBModel } from "../models/ticketEditor/CreateQuestionDBModel";
import type { QuestionViewModel } from "../models/ticketEditor/QuestionViewModel";

export const questionController = {
	async sendQuestion(
		req: RequestWithBody<{ ticketId: string; questionId: "string" }>,
		res: Response<QuestionViewModel | ErrorType>,
	) {
		try {
			const question = await questionService.sendQuestion({
				ticketId: req.body.ticketId,
				questionId: req.body.questionId,
				userId: req.userId || "",
			});

			res.json(question);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось отправить вопрос", error, res });
		}
	},
};
