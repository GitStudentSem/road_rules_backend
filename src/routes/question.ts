import { checkAuth } from "../midlewares";
import { questionController } from "../controllers/questionController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import express from "express";
import { SendQuestionViewModelSwaggerDoc } from "../models/tickets/SendQuestionViewModel";
import { defaultSwaggerValues } from "../assets/settings";

export const questionSwaggerDoc = {
	"/question": {
		post: {
			tags: ["Скорее всего под удаление"],
			summary: "Получить конкретный вопрос",
			security: [{ bearerAuth: [] }],

			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								ticketId: {
									type: "string",
									description: "id билета",
									default: defaultSwaggerValues.ticketId,
								},
								questionId: {
									type: "string",
									description: "id вопроса",
									default: defaultSwaggerValues.questionId,
								},
							},
							required: ["ticketId", "questionId"],
						},
					},
				},
			},

			responses: {
				200: {
					description: "Вопрос успешно получен",
					content: {
						"application/json": {
							schema: SendQuestionViewModelSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения вопроса"),
			},
		},
	},
};

export const questionRouter = () => {
	const router = express.Router();

	router.post("/", checkAuth, questionController.sendQuestion);

	return router;
};
