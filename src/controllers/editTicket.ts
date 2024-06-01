import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";

import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";

import { editTicketService } from "../domain/editTicketService";
import type { CreateQuestionBody } from "../models/editTicket/CreateQuestionBody";
import type { DeleteTicketBody } from "../models/editTicket/DeleteTicketBody";

export const createTicket = async (
	req: Request,
	res: Response<{ isCreated: boolean } | ErrorType>,
) => {
	try {
		const isCreated = await editTicketService.createTicket();
		res.status(HTTP_STATUSES.OK_200).json({ isCreated });
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
	res: Response<{ isCreated: boolean } | ErrorType>,
) => {
	try {
		const { img, question, help, answers, ticketId } = req.body;

		const isCreated = await editTicketService.addQuestion({
			img,
			ticketId,
			question,
			help,
			answers,
		});

		res.status(HTTP_STATUSES.OK_200).json({ isCreated });
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
	res: Response<{ isDeleted: boolean } | ErrorType>,
) => {
	try {
		const { ticketId } = req.body;

		const isDeleted = await editTicketService.deleteTicket(ticketId);

		res.status(HTTP_STATUSES.OK_200).json({ isDeleted });
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось удалить билет", error, res });
	}
};
export const deleteQuestion = async (
	req: RequestWithBody<DeleteTicketBody>,
	res: Response<{ isDeleted: boolean } | ErrorType>,
) => {
	try {
		const { ticketId, questionId } = req.body;

		const isDeleted = await editTicketService.deleteQuestion({
			ticketId,
			questionId,
		});

		res.status(HTTP_STATUSES.OK_200).json({ isDeleted });
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось удалить влпрос", error, res });
	}
};
