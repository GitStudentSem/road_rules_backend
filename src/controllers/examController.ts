import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithParamsAndBody } from "../types";

import type { SendExamViewModel } from "../models/exam/SendExamViewModel";
import type { SendExamResultViewModel } from "../models/exam/SendExamResultViewModel";
import type { BodySendExamResult } from "../models/exam/BodySendExamResult";
import { DBError } from "./DBError";
import { examService } from "../domain/examService";

export const sendExam = async (
	req: Request,
	res: Response<SendExamViewModel[] | ErrorType>,
) => {
	try {
		//@ts-ignore
		const exam = await examService.sendExam(req.userId);

		// Сделать по типизации, сейчас ticketNumber не совпадает с ticketId полем
		console.log("exam", exam);
		res.json(exam);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendExamResult = async (
	req: RequestWithParamsAndBody<{ ticketId: string }, BodySendExamResult>,
	res: Response<SendExamResultViewModel | ErrorType>,
) => {
	try {
		const result = await examService.sendExamResult({
			//@ts-ignore
			userId: req.userId,
			ticketId: req.params.ticketId,
			questionId: req.body.questionId,
			answerId: req.body.answerId,
		});

		res.json(result);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};
