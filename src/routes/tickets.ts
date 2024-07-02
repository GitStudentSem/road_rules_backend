import express from "express";
import { answerValidation } from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { ticketsController } from "../controllers/ticketsController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { SendTicketsViewModelSwaggerDoc } from "../models/tickets/SendTicketsViewModel";
import { SendTicketViewModelSwaggerDoc } from "../models/tickets/SendTicketViewModel";
import { BodySendTicketResultSwaggerDoc } from "../models/tickets/BodySendTicketResult";
import { SendTicketResultViewModelModelSwaggerDoc } from "../models/tickets/SendTicketResultViewModel";
import { defaultSwaggerValues } from "../assets/settings";

export const ticketsSwaggerDoc = {
	"/tickets": {
		get: {
			tags: ["Билеты"],
			summary: "Получить список билетов для выбора",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Количество билетов упешно получено",
					content: {
						"application/json": {
							schema: SendTicketsViewModelSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения количества билетов"),
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
							schema: SendTicketResultViewModelModelSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка отправки ответа"),
			},
		},
	},

	"/tickets/{ticketId}": {
		get: {
			tags: ["Билеты"],
			summary: "Получить указанный билет",
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "ticketId",
					in: "path",
					description: "id билета",
					required: true,
					default: defaultSwaggerValues.ticketId,
				},
			],
			responses: {
				200: {
					description: "Билет успешно получен",
					content: {
						"application/json": {
							schema: SendTicketViewModelSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения билета"),
			},
		},
	},
};

export const getTicketsRouter = () => {
	const router = express.Router();

	router.get("/", checkAuth, ticketsController.sendTickets);

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
