import express from "express";
import { answerValidation } from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { ticketsController } from "../controllers/ticketsController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { ViewSendTicketsSwaggerDoc } from "../types/controllers/ticketsController";
import {
	ParamsSendTicketSwaggerDoc,
	ViewSendTicketSwaggerDoc,
	BodySendTicketResultSwaggerDoc,
	ViewSendTicketResultSwaggerDoc,
} from "../types/controllers/ticketsController";

export const ticketsSwaggerDoc = {
	"/api/tickets/{ticketId}": {
		get: {
			tags: ["Билеты"],
			summary: "Получить указанный билет",
			security: [{ bearerAuth: [] }],
			parameters: [ParamsSendTicketSwaggerDoc],
			responses: {
				200: {
					description: "Билет успешно получен",
					content: {
						"application/json": {
							schema: {
								type: "array",
								description: "Билет с вопросами",
								items: ViewSendTicketSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения билета"),
			},
		},
	},
	"/api/tickets/failedQuestions": {
		get: {
			tags: ["Билеты"],
			summary: "Получить вопросы с ошибками",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Вопросы успешно получены",
					content: {
						"application/json": {
							schema: {
								type: "array",
								description: "Вопросы с ошибками",
								items: ViewSendTicketSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения вопросов"),
			},
		},
	},
	"/api/tickets": {
		get: {
			tags: ["Билеты"],
			summary: "Получить список билетов для выбора, без пустых билетов",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Билеты упешно получены",
					content: {
						"application/json": {
							schema: ViewSendTicketsSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения билетов"),
			},
		},
		post: {
			tags: ["Билеты"],
			summary: "Отправить ответ на вопрос по билету",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendTicketResultSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Ответ успешно отправлен",
					content: {
						"application/json": {
							schema: ViewSendTicketResultSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка отправки ответа"),
			},
		},
	},
};

export const getTicketsRouter = () => {
	const router = express.Router();

	router.get("/", checkAuth, ticketsController.sendTickets);

	router.get(
		"/failedQuestions",
		checkAuth,
		ticketsController.sendFailedQuestions,
	);

	router.get("/:ticketId", checkAuth, ticketsController.sendTicket);

	router.post(
		"/",
		checkAuth,
		answerValidation,
		handleValidationErrors,
		ticketsController.sendTicketResult,
	);

	return router;
};
