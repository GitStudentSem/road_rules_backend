import type { Request, Response } from "express";
import { sendError } from "../assets/requestAssets";
import { ticketService } from "../domain/ticketService";
import type { BodySendTicketResult } from "../models/tickets/BodySendTicketResult";
import type { SendTicketResultViewModel } from "../models/tickets/SendTicketResultViewModel";
import type { SendTicketViewModel } from "../models/tickets/SendTicketViewModel";
import type { SendTicketsViewModel } from "../models/tickets/SendTicketsViewModel";
import type {
	ErrorType,
	RequestWithParams,
	RequestWithParamsAndBody,
} from "../types";
import { DBError } from "./DBError";

export const sendTickets = async (
	req: Request,
	res: Response<SendTicketsViewModel | ErrorType>,
) => {
	try {
		//@ts-ignore
		const tickets = await ticketService.sendTickets(req.userId);

		res.json(tickets);
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
			req.body.answerId,
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
