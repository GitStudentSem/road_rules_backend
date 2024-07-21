import express from "express";
import { answerValidation } from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { examController } from "../controllers/examController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { ViewSendExamSwaggerDoc } from "../types/controllers/examController";
import { BodySendExamAnswerSwaggerDoc } from "../types/controllers/examController";
import { ViewSendExamAnswerSwaggerDoc } from "../types/controllers/examController";
import { ViewGetExamResultSwaggerDoc } from "../types/controllers/examController";

export const examSwaggerDoc = {
	"/api/exam": {
		get: {
			tags: ["Экзамен"],
			summary: "Получить вопросы по экзамену",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Экзамен получен",
					content: {
						"application/json": {
							schema: ViewSendExamSwaggerDoc,
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
						schema: BodySendExamAnswerSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Ответ успешно отправлен",
					content: {
						"application/json": {
							schema: ViewSendExamAnswerSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка отправки ответа"),
			},
		},
	},

	"/api/exam/training": {
		post: {
			tags: ["Экзамен"],
			summary: "Отправить ответ на вопрос по тренировочному экзамену",
			security: [{ bearerAuth: [] }],

			requestBody: {
				content: {
					"application/json": {
						schema: BodySendExamAnswerSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Ответ успешно отправлен",
					content: {
						"application/json": {
							schema: ViewSendExamAnswerSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка отправки ответа"),
			},
		},
	},

	"/api/exam/getResult": {
		get: {
			tags: ["Экзамен"],
			summary:
				"Получить результаты экзамена, для пользователя который запрашивает",
			security: [{ bearerAuth: [] }],

			responses: {
				200: {
					description: "Результат успешно отправлен",
					content: {
						"application/json": {
							schema: ViewGetExamResultSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка отправки результата"),
			},
		},
	},

	"/api/exam/getTrainingResult": {
		get: {
			tags: ["Экзамен"],
			summary:
				"Получить результаты тренировочного экзамена, для пользователя который запрашивает",
			security: [{ bearerAuth: [] }],

			responses: {
				200: {
					description: "Результат успешно отправлен",
					content: {
						"application/json": {
							schema: ViewGetExamResultSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка отправки результата"),
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
		examController.sendExamAnswer,
	);

	router.post(
		"/training",
		checkAuth,
		answerValidation,
		handleValidationErrors,
		examController.sendTrainingExamAnswer,
	);

	router.get("/getResult", checkAuth, examController.getExamResult);
	router.get(
		"/getTrainingResult",
		checkAuth,
		examController.getTrainingExamResult,
	);
	router.post("/setAlwaysComplete", examController.setAlwaysCompleteExam);

	return router;
};
