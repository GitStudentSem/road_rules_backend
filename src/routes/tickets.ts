import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";
import * as ticketController from "../controllers/ticketsController";
import { getErrorWaggerDoc } from "../assets/getErrorSwaggerDoc";
import { SendTicketsViewModelSwaggerDoc } from "../models/tickets/SendTicketsViewModel";
import { SendTicketViewModelSwaggerDoc } from "../models/tickets/SendTicketViewModel";
import { BodySendTicketResultSwaggerDoc } from "../models/tickets/BodySendTicketResult";

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
				error: getErrorWaggerDoc("Ошибка получения количества билетов"),
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
					default: "1717841402302",
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
				error: getErrorWaggerDoc("Ошибка получения билета"),
			},
		},

		post: {
			tags: ["Билеты"],
			summary: "Отправить ответ на вопрос по билету",
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "ticketId",
					in: "path",
					description: "id билета",
					required: true,
					default: 1717841402302,
				},
			],
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

	router.get("/", checkAuth, ticketController.sendTickets);

	router.get("/:ticketId", checkAuth, ticketController.sendTicket);

	router.post(
		"/:ticketId",
		checkAuth,
		answerValidation,
		ticketController.sendTicketResult,
	);

	return router;
};
