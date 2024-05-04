import { sendError } from "../assets/requestAssets";
// удалить импорты после экзамена проверить импорты
import { getUserFilePath, isUserExist } from "../assets/userAssets";
import { checkUserAnswer, isTicketExist } from "../assets/ticketsAssets";
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
import { DBError } from "./DBError";
import { ticketService } from "../domain/ticketService";

export const sendTicketsCount = async (
	req: Request,
	res: Response<sendTicketsCountViewModel | ErrorType>,
) => {
	try {
		//@ts-ignore
		const ticketsCount = await ticketService.sendTicketsCount(req.userId);

		res.json({ ticketsCount });
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendTicket = async (
	req: RequestWithParams<{ ticketNumber: string }>,
	res: Response<SendTicketViewModel[] | ErrorType>,
) => {
	try {
		const ticket = await ticketService.sendTicket(
			//@ts-ignore
			req.userId,
			+req.params.ticketNumber,
		);

		res.json(ticket);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendTicketResult = async (
	req: RequestWithParamsAndBody<{ ticketNumber: string }, BodySendTicketResult>,
	res: Response<SendTicketResultViewModel | ErrorType>,
) => {
	try {
		const result = await ticketService.sendTicketResult(
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
