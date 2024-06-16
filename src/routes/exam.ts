import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";

import * as examController from "../controllers/examController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
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
				error: getErrorSwaggerDoc("Ошибка получения экзамена"),
			},
		},
		post: {
			tags: ["Экзамен"],
			summary: "Отправить ответ на вопрос по экзамену",
			security: [{ bearerAuth: [] }],

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
				error: getErrorSwaggerDoc("Ошибка отправки ответа"),
			},
		},
	},
	"/exam/training": {
		post: {
			tags: ["Экзамен"],
			summary: "Отправить ответ на вопрос по тренировочному экзамену",
			security: [{ bearerAuth: [] }],

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
				error: getErrorSwaggerDoc("Ошибка отправки ответа"),
			},
		},
	},
};

export const getExamRouter = () => {
	const router = express.Router();

	router.get("/", checkAuth, examController.sendExam);

	router.post("/", checkAuth, answerValidation, examController.sendExamResult);
	router.post(
		"/training",
		checkAuth,
		answerValidation,
		examController.sendTrainingExamResult,
	);

	return router;
};
