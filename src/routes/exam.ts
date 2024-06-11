import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";

import * as examController from "../controllers/examController";
import { getErrorWaggerDoc } from "../assets/getErrorSwaggerDoc";
import { SendExamViewModelSwaggerDoc } from "../models/exam/SendExamViewModel";
import { BodySendExamResultSwaggerDoc } from "../models/exam/BodySendExamResult";
import { SendExamResultViewModelSwaggerDoc } from "../models/exam/SendExamResultViewModel";

export const examSwaggerDoc = {
	"/exam": {
		get: {
			tags: ["Экзамен"],
			summary: "Получить вопросы по экзамену",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Экзамен получен",
					content: {
						"application/json": {
							schema: SendExamViewModelSwaggerDoc,
						},
					},
				},
				error: getErrorWaggerDoc("Ошибка получения экзамена"),
			},
		},
	},

	"/exam/{ticketId}": {
		post: {
			tags: ["Экзамен"],
			summary: "Отправить ответ на вопрос по экзамену",
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "ticketId",
					in: "path",
					description: "id билета",
					required: true,
					default: "1717841402302",
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendExamResultSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Ответ успешно отправлен",
					content: {
						"application/json": {
							schema: SendExamResultViewModelSwaggerDoc,
						},
					},
				},
				error: getErrorWaggerDoc("Ошибка отправки ответа"),
			},
		},
	},
};
export const getExamRouter = () => {
	const router = express.Router();

	router.get("/", checkAuth, examController.sendExam);

	router.post(
		"/:ticketNumber",
		checkAuth,
		answerValidation,
		examController.sendExamResult,
	);

	return router;
};
