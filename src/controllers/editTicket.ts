import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";

import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";

import { editTicketService } from "../domain/editTicketService";
import type { CreateQuestionBody } from "../modeles/editTicket/CreateQuestionBody";

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
		console.log("===============");
		const { img, question, help, answers, ticketId } = req.body;
		console.log({ img, question, help, answers, ticketId });
		const isCreated = await editTicketService.addQuestion({
			img,
			ticketId,
			question,
			help,
			answers,
		});

		res.status(HTTP_STATUSES.OK_200).json({ isCreated: true });
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось создать билет", error, res });
	}
};
