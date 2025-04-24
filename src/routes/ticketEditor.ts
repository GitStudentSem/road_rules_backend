import express from "express";
import { ticketEditorController } from "../controllers/ticketEditorController";
import { addQuestionValidation } from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";

import {
	BodyGetQuestionsInTicketSwaggerDoc,
	BodyCreateQuestionSwaggerDoc,
	BodyEditQuestionSwaggerDoc,
	ViewSendTicketsSwaggerDoc,
	BodyDeleteTicketSwaggerDoc,
	BodyDeleteQuestionSwaggerDoc,
	ViewGetQuestionsInTicketSwaggerDoc,
	ViewCreateTicketSwaggerDoc,
} from "../types/controllers/ticketEditorController";
import { upload } from "../app";

export const ticketEditorSwaggerDoc = {
	"/api/ticketEditor/tickets": {
		get: {
			tags: ["Редактор билетов"],
			summary: "Получить список билетов для выбора, включая пустые",
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
	},

	"/api/ticketEditor/createTicket": {
		get: {
			tags: ["Редактор билетов"],
			summary: "Создать пустой билет",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Билет успешно создан",
					content: {
						"application/json": {
							schema: ViewCreateTicketSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка создания билета"),
			},
		},
	},

	"/api/ticketEditor/getQuestions": {
		post: {
			tags: ["Редактор билетов"],
			summary: "Получить вопросы в билете",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyGetQuestionsInTicketSwaggerDoc,
					},
				},
			},

			responses: {
				200: {
					description: "Вопросы успешно получены",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: ViewGetQuestionsInTicketSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения вопросов"),
			},
		},
	},

	"/api/ticketEditor/createQuestion": {
		post: {
			tags: ["Редактор билетов"],
			summary: "Добавить вопрос в билет",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"multipart/form-data": {
						schema: BodyCreateQuestionSwaggerDoc,
						encoding: {
							answers: {
								style: "form",
								explode: true,
							},
						},
					},
				},
			},
			responses: {
				204: {
					description: "Вопрос успешно добавлен",
				},
				error: getErrorSwaggerDoc("Ошибка добавления вопроса"),
			},
		},
	},

	"/api/ticketEditor/editQuestion": {
		patch: {
			tags: ["Редактор билетов"],
			summary: "Изменить существующий вопрос",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"multipart/form-data": {
						schema: BodyEditQuestionSwaggerDoc,
						encoding: {
							answers: {
								style: "form",
								explode: true,
							},
						},
					},
				},
			},
			responses: {
				204: {
					description: "Вопрос успешно изменен",
				},
				error: getErrorSwaggerDoc("Ошибка изменения вопроса"),
			},
		},
	},

	"/api/ticketEditor/deleteTicket": {
		delete: {
			tags: ["Редактор билетов"],
			summary: "Удалить билет",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyDeleteTicketSwaggerDoc,
					},
				},
			},
			responses: {
				204: {
					description: "Билет успешно удален",
				},
				error: getErrorSwaggerDoc("Ошибка удаления билета"),
			},
		},
	},

	"/api/ticketEditor/deleteQuestion": {
		delete: {
			tags: ["Редактор билетов"],
			summary: "Удалить вопрос из билета",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": { schema: BodyDeleteQuestionSwaggerDoc },
				},
			},
			responses: {
				204: {
					description: "Вопрос успешно удален",
				},
				error: getErrorSwaggerDoc("Ошибка удаления вопроса"),
			},
		},
	},
};

export const ticketEditorRouter = () => {
	const router = express.Router();

	router.get("/tickets", checkAuth, ticketEditorController.sendTickets);
	router.get("/createTicket", checkAuth, ticketEditorController.createTicket);
	router.post(
		"/getQuestions",
		checkAuth,
		ticketEditorController.getQuestionsInTicket,
	);
	router.post(
		"/createQuestion",
		checkAuth,
		upload.single("img"),
		addQuestionValidation,
		handleValidationErrors,
		ticketEditorController.createQuestion,
	);

	router.delete(
		"/deleteQuestion",
		checkAuth,
		ticketEditorController.deleteQuestion,
	);
	router.delete(
		"/deleteTicket",
		checkAuth,
		ticketEditorController.deleteTicket,
	);
	router.patch(
		"/editQuestion",
		checkAuth,
		upload.single("img"),
		addQuestionValidation,
		handleValidationErrors,
		ticketEditorController.editQuestion,
	);

	return router;
};
