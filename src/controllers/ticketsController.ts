import type { Request, Response } from "express";
import { sendError } from "../assets/requestAssets";
import { ticketService } from "../services/ticketService";
import type {
	ParamsSendTicket,
	ViewSendTicket,
	ViewSendTickets,
	BodySendTicketResult,
	ViewSendTicketResult,
} from "../types/controllers/tickets";
import type { ErrorType, RequestWithBody, RequestWithParams } from "../types";
import { DBError } from "./DBError";

export const ticketsController = {
	async sendTickets(
		req: Request,
		res: Response<ViewSendTickets[] | ErrorType>,
	) {
		try {
			const tickets = await ticketService.sendTickets(req.userId || "");

			res.json(tickets);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось отправить билеты", error, res });
		}
	},

	async sendTicket(
		req: RequestWithParams<ParamsSendTicket>,
		res: Response<ViewSendTicket[] | ErrorType>,
	) {
		try {
			const ticket = await ticketService.sendTicket(
				req.userId || "",
				req.params.ticketId,
			);

			res.json(ticket);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось отправить билет", error, res });
		}
	},
	async sendTicketResult(
		req: RequestWithBody<BodySendTicketResult>,
		res: Response<ViewSendTicketResult | ErrorType>,
	) {
		try {
			const result = await ticketService.sendTicketResult({
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
				message: "Не удалось отправить ответ на вопрос",
				error,
				res,
			});
		}
	},
};
