import { sendError } from "../assets/requestAssets";
import { getUserFilePath, isUserExist } from "../assets/userAssets";
import {
	checkUserAnswer,
	getExam,
	isTicketExist,
} from "../assets/ticketsAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithParamsAndBody } from "../types";

import type { SendExamViewModel } from "../modeles/exam/SendExamViewModel";
import type { SendExamTicketResultViewModel } from "../modeles/exam/SendExamTicketResultViewModel";
import type { BodySendExamResult } from "../modeles/exam/BodySendExamResult";
import { DBError } from "./DBError";
import { examService } from "../domain/examService";

export const sendExam = async (
	req: Request,
	res: Response<SendExamViewModel[] | ErrorType>,
) => {
	try {
		//@ts-ignore
		const exam = await examService.sendExam(req.userId);

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
	req: RequestWithParamsAndBody<{ ticketNumber: string }, BodySendExamResult>,
	res: Response<SendExamTicketResultViewModel | ErrorType>,
) => {
	try {
		const result = await examService.sendExamResult(
			//@ts-ignore
			req.userId,
			+req.params.ticketNumber,
			req.body.questionNumber,
			req.body.userAnswer,
		);

		res.json(result);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};
