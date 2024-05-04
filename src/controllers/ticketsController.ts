import { sendError } from "../assets/requestAssets";
import { getUserFilePath, isUserExist } from "../assets/userAssets";
import { db } from "../app";
import {
	checkUserAnswer,
	getCountTickets,
	isTicketExist,
} from "../assets/ticketsAssets";
import type { Request, Response } from "express";
import type {
	ErrorType,
	RequestWithParams,
	RequestWithParamsAndBody,
} from "../types";
import type { sendTicketsCountViewModel } from "../modeles/tickets/SendTicketsCountViewModel";
import type { SendTicketViewModel } from "../modeles/tickets/SendTicketViewModel";
import type { SendTicketResultViewModel } from "../modeles/tickets/SendTicketResultViewModel";
import type { BodySendTicketResult } from "../modeles/tickets/BodySendTicketResult";

export const sendTicketsCount = async (
	req: Request,
	res: Response<sendTicketsCountViewModel | ErrorType>,
) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		res.json({ ticketsCount: getCountTickets() });
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendTicket = async (
	req: RequestWithParams<{ ticketNumber: string }>,
	res: Response<SendTicketViewModel[] | ErrorType>,
) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		const { ticketNumber } = req.params;

		const ticket = isTicketExist(Number(ticketNumber), res);
		if (!ticket) return;

		res.json(ticket);
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendTicketResult = async (
	req: RequestWithParamsAndBody<{ ticketNumber: string }, BodySendTicketResult>,
	res: Response<SendTicketResultViewModel | ErrorType>,
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
		const pathToAnswer = `${filePath}/results/ticket-${ticketNumber}`;

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
