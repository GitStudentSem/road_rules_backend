import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";

import * as examController from "../controllers/examController";
import { getErrorWaggerDoc } from "../assets/getErrorSwaggerDoc";

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
							schema: {
								$ref: "#/components/schemas/SendExamViewModel",
							},
						},
					},
				},
				error: getErrorWaggerDoc("Ошибка получения экзамена"),
			},
		},
	},

	"/exam/{ticketNumber}": {
		post: {
			tags: ["Экзамен"],
			summary: "Отправить ответ на вопрос по экзамену",
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "ticketNumber",
					in: "path",
					description: "Порядковый номер билета",
					required: true,
					default: 1,
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/BodySendExamResult" },
					},
				},
			},
			responses: {
				200: {
					description: "Ответ успешно отправлен",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/SendExamResultViewModel",
							},
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
