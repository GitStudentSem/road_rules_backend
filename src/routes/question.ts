import { checkAuth } from "../midlewares";
import { questionController } from "../controllers/questionController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import express from "express";
import { SendQuestionViewModelSwaggerDoc } from "../models/tickets/SendQuestionViewModel";

export const questionSwaggerDoc = {
	"/question": {
		post: {
			tags: ["Билеты", "Экзамен", "Редактор билетов"],
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
									default: "1719675339512",
								},
								questionId: {
									type: "string",
									description: "id вопроса",
									default: "1719675471864",
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
