import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";

import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";

import { ticketEditorService } from "../domain/ticketEditorService";
import type { CreateQuestionBody } from "../models/ticketEditor/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/ticketEditor/DeleteQuestionBody";
import type { EditQuestionBody } from "../models/ticketEditor/EditQuestionBody";
import type { QuestionsViewModel } from "../models/ticketEditor/QuestionsViewModel";

export const createTicket = async (
	req: Request,
	res: Response<{ ticketId: string } | ErrorType>,
) => {
	try {
		const ticketId = await ticketEditorService.createTicket();
		res.json({ ticketId });
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось создать билет", error, res });
	}
};

export const getQuestionsInTicket = async (
	req: RequestWithBody<{ ticketId: string }>,
	res: Response<QuestionsViewModel[] | ErrorType>,
) => {
	const { ticketId } = req.body;
	const questions = await ticketEditorService.getQuestionsInTicket(ticketId);
	res.json(questions);
};

export const addQuestion = async (
	req: RequestWithBody<CreateQuestionBody>,
	res: Response<ErrorType>,
) => {
	try {
		const img = req.file?.buffer;
		const { question, help, answers, ticketId, correctAnswer } = req.body;

		await ticketEditorService.addQuestion({
			img,
			ticketId,
			question,
			help,
			correctAnswer: Number(correctAnswer),
			answers,
		});

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось добавить вопрос", error, res });
	}
};
export const editQuestion = async (
	req: RequestWithBody<EditQuestionBody>,
	res: Response<ErrorType>,
) => {
	try {
		const img = req.file?.buffer;
		const { question, help, answers, ticketId, questionId, correctAnswer } =
			req.body;
		await ticketEditorService.editQuestion({
			img,
			ticketId,
			questionId,
			question,
			help,
			correctAnswer: Number(correctAnswer),
			answers,
		});

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
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

		await ticketEditorService.deleteTicket(ticketId);

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
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

		await ticketEditorService.deleteQuestion({
			ticketId,
			questionId,
		});

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось удалить влпрос", error, res });
	}
};
