import express from "express";
import { answerValidation, appointExamValidation } from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";

import * as examController from "../controllers/examController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { SendExamViewModelSwaggerDoc } from "../models/exam/SendExamViewModel";
import { BodySendExamResultSwaggerDoc } from "../models/exam/BodySendExamResult";
import { SendExamResultViewModelSwaggerDoc } from "../models/exam/SendExamResultViewModel";
import { BodyAppointExamSwaggerDoc } from "../models/exam/BodyAppointExam";

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
	"/exam/appoint": {
		post: {
			tags: ["Экзамен"],
			summary: "Назначить экзамен для пользователя",
			// security: [{ bearerAuth: [] }],

			requestBody: {
				content: {
					"application/json": {
						schema: BodyAppointExamSwaggerDoc,
					},
				},
			},
			responses: {
				204: {
					description: "Экзамен назначен",
				},
				error: getErrorSwaggerDoc("Ошибка назначения экзамена"),
			},
		},
	},
};

export const getExamRouter = () => {
	const router = express.Router();

	router.get("/", checkAuth, examController.sendExam);

	router.post(
		"/",
		checkAuth,
		answerValidation,
		handleValidationErrors,
		examController.sendExamResult,
	);
	router.post(
		"/appoint",
		appointExamValidation,
		handleValidationErrors,
		examController.appointExam,
	);
	router.post(
		"/training",
		checkAuth,
		answerValidation,
		handleValidationErrors,
		examController.sendTrainingExamResult,
	);

	return router;
};
