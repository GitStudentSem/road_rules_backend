import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";

import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";

import { editTicketService } from "../domain/editTicketService";
import type { CreateQuestionBody } from "../models/editTicket/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/editTicket/DeleteQuestionBody";

export const createTicket = async (req: Request, res: Response<ErrorType>) => {
	try {
		await editTicketService.createTicket();
		res.status(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось создать билет", error, res });
	}
};

export const addQuestion = async (
	req: RequestWithBody<CreateQuestionBody>,
	res: Response<ErrorType>,
) => {
	try {
		const { img, question, help, answers, ticketId } = req.body;

		await editTicketService.addQuestion({
			img,
			ticketId,
			question,
			help,
			answers,
		});

		res.status(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось добавить вопрос", error, res });
	}
};

export const deleteTicket = async (
	req: RequestWithBody<{ ticketId: string }>,
	res: Response<ErrorType>,
) => {
	try {
		const { ticketId } = req.body;

		await editTicketService.deleteTicket(ticketId);

		res.status(HTTP_STATUSES.OK_200);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось удалить билет", error, res });
	}
};
export const deleteQuestion = async (
	req: RequestWithBody<DeleteQuestionBody>,
	res: Response<ErrorType>,
) => {
	try {
		const { ticketId, questionId } = req.body;

		await editTicketService.deleteQuestion({
			ticketId,
			questionId,
		});

		res.status(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось удалить влпрос", error, res });
	}
};
