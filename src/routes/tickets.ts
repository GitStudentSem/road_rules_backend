import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";
import * as ticketController from "../controllers/ticketsController";
import { getErrorWaggerDoc } from "../assets/getErrorSwaggerDoc";

export const ticketsSwaggerDoc = {
	"/tickets/count": {
		get: {
			tags: ["Билеты"],
			summary: "Получить количество билетов",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Количество билетов упешно получено",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/SendTicketsCountViewModel",
							},
						},
					},
				},
				error: getErrorWaggerDoc("Ошибка получения количества билетов"),
			},
		},
	},

	"/tickets/{ticketNumber}": {
		get: {
			tags: ["Билеты"],
			summary: "Получить указанный билет",
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
			responses: {
				200: {
					description: "Билет успешно получен",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/components/schemas/SendTicketViewModel",
								},
							},
						},
					},
				},
				error: getErrorWaggerDoc("Ошибка получения билета"),
			},
		},

		post: {
			tags: ["Билеты"],
			summary: "Отправить ответ на вопрос по билету",
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
						schema: { $ref: "#/components/schemas/BodySendTicketResult" },
					},
				},
			},
			responses: {
				200: {
					description: "Ответ успешно отправлен",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/SendTicketResultViewModel",
							},
						},
					},
				},
				error: getErrorWaggerDoc("Ошибка отправки ответа"),
			},
		},
	},
};

export const getTicketsRouter = () => {
	const router = express.Router();

	router.get("/count", checkAuth, ticketController.sendTicketsCount);

	router.get("/:ticketNumber", checkAuth, ticketController.sendTicket);

	router.post(
		"/:ticketNumber",
		checkAuth,
		answerValidation,
		ticketController.sendTicketResult,
	);

	return router;
};
