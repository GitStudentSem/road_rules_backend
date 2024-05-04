import { sendError } from "../assets/requestAssets";
import { getUserFilePath, isUserExist } from "../assets/userAssets";
import { db } from "../app";
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

export const sendExam = async (
	req: Request,
	res: Response<SendExamViewModel[] | ErrorType>,
) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		res.json(getExam());
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendExamResult = async (
	req: RequestWithParamsAndBody<{ ticketNumber: string }, BodySendExamResult>,
	res: Response<SendExamTicketResultViewModel | ErrorType>,
) => {
	try {
		const user = await isUserExist(req, res);

		if (!user) return;

		const { ticketNumber } = req.params;
		const { userAnswer, questionNumber } = req.body;

		const ticket = isTicketExist(Number(ticketNumber), res);
		if (!ticket) return;

		const result = checkUserAnswer({
			ticketNumber: Number(ticketNumber),
			questionNumber,
			userAnswer,
			res,
		});

		if (!result) return;

		const filePath = getUserFilePath(user.email);
		const pathToAnswer = `${filePath}/results/exam`;

		const isExistAnswer = await db.exists(pathToAnswer);
		if (!isExistAnswer) await db.push(pathToAnswer, Array(20).fill(-1));

		const copyAnswers = await db.getData(pathToAnswer);

		copyAnswers[questionNumber - 1] = userAnswer;
		await db.push(pathToAnswer, copyAnswers);

		res.json(result);
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};
