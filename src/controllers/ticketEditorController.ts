import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";

import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";

import { ticketEditorService } from "../domain/ticketEditorService";
import type { CreateQuestionBody } from "../models/ticketEditor/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/ticketEditor/DeleteQuestionBody";
import type { EditQuestionBody } from "../models/ticketEditor/EditQuestionBody";
import type { QuestionViewModel } from "../models/ticketEditor/QuestionViewModel";

export const createTicket = async (
	req: Request,
	res: Response<{ ticketId: string } | ErrorType>,
) => {
	try {
		const ticketId = await ticketEditorService.createTicket(req.userId || "");
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
	res: Response<QuestionViewModel[] | ErrorType>,
) => {
	try {
		const { ticketId } = req.body;
		const questions = await ticketEditorService.getQuestionsInTicket(
			ticketId,
			req.userId || "",
		);
		res.json(questions);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось добавить вопрос", error, res });
	}
};

export const createQuestion = async (
	req: RequestWithBody<CreateQuestionBody>,
	res: Response<ErrorType>,
) => {
	try {
		const img = req.file?.buffer;
		const { question, help, answers, ticketId, correctAnswer } = req.body;

		await ticketEditorService.createQuestion({
			img,
			ticketId,
			question,
			help,
			correctAnswer: Number(correctAnswer),
			answers,
			userId: req.userId || "",
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
			userId: req.userId || "",
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

		await ticketEditorService.deleteTicket(ticketId, req.userId || "");

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
			userId: req.userId || "",
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
