import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody, RequestWithParams } from "../types";

import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";

import { editTicketService } from "../domain/editTicketService";
import type { CreateQuestionBody } from "../models/editTicket/CreateQuestionBody";

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
		sendError({ message: "Не удалось создать билет", error, res });
	}
};

export const deleteQuestion = async (
	req: RequestWithParams<{ questionId: string }>,
	res: Response<{ isDeleted: boolean } | ErrorType>,
) => {
	try {
		const { questionId } = req.params;

		const isDeleted = await editTicketService.deleteQuestion(questionId);

		res.status(HTTP_STATUSES.OK_200).json({ isDeleted });
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось создать билет", error, res });
	}
};
