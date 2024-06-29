import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type {
	ErrorType,
	RequestWithBody,
	RequestWithParamsAndBody,
} from "../types";

import type { SendExamViewModel } from "../models/exam/SendExamViewModel";
import type { SendExamResultViewModel } from "../models/exam/SendExamResultViewModel";
import type { BodySendExamResult } from "../models/exam/BodySendExamResult";
import { DBError } from "./DBError";
import { examService } from "../domain/examService";
import { HTTP_STATUSES } from "../utils";
import type { BodyAppointExam } from "../models/exam/BodyAppointExam";

export const sendExam = async (
	req: Request,
	res: Response<SendExamViewModel[] | ErrorType>,
) => {
	try {
		const exam = await examService.sendExam(req.userId || "");

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
	req: RequestWithBody<BodySendExamResult>,
	res: Response<SendExamResultViewModel | ErrorType>,
) => {
	try {
		const result = await examService.sendExamResult({
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
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendTrainingExamResult = async (
	req: RequestWithBody<BodySendExamResult>,
	res: Response<SendExamResultViewModel | ErrorType>,
) => {
	try {
		const result = await examService.sendTrainingExamResult({
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
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};
export const appointExam = async (
	req: RequestWithBody<BodyAppointExam>,
	res: Response<ErrorType>,
) => {
	try {
		await examService.appointExam({
			isAppoint: req.body.isAppoint,
			email: req.body.email,
		});

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};
