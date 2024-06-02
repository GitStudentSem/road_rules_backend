import express from "express";
import * as editTicketController from "../controllers/editTicket";
import { addQuestionValidation } from "../validations";
import { handleValudationErrors } from "../midlewares";

export const editTicketSwaggerDoc = {
	"/editTicket/createTicket": {
		get: {
			tags: ["Редактор билетов"],
			summary: "Создать пустой билет",
			// security: [{ bearerAuth: [] }],
			responses: {
				204: {
					description: "Билет упешно создан",
				},
				error: {
					description: "Ошибка создания билета",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ErrorType",
							},
						},
					},
				},
			},
		},
	},

	"/editTicket/addQuestion": {
		post: {
			tags: ["Редактор билетов"],
			summary: "Добавить вопрос в билет",
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/CreateQuestionBody" },
					},
				},
			},
			responses: {
				204: {
					description: "Вопрос успешно добавлен",
				},
				error: {
					description: "Ошибка добавления вопроса",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ErrorType",
							},
						},
					},
				},
			},
		},
	},

	"/editTicket/deleteTicket": {
		delete: {
			tags: ["Редактор билетов"],
			summary: "Удалить билет",
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								ticketId: {
									type: "string",
									description: "id удаляемого билета",
								},
							},
						},
					},
				},
			},
			responses: {
				204: {
					description: "Билет успешно удален",
				},
				error: {
					description: "Ошибка удаления билета",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ErrorType",
							},
						},
					},
				},
			},
		},
	},

	"/editTicket/deleteQuestion": {
		delete: {
			tags: ["Редактор билетов"],
			summary: "Удалить вопрос из билета",
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/DeleteQuestionBody" },
					},
				},
			},
			responses: {
				204: {
					description: "Вопрос успешно удален",
				},
				error: {
					description: "Ошибка удаления вопроса",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ErrorType",
							},
						},
					},
				},
			},
		},
	},
};

export const editTicketRouter = () => {
	const router = express.Router();

	router.get("/createTicket", editTicketController.createTicket);

	router.post(
		"/addQuestion",
		addQuestionValidation,
		handleValudationErrors,
		editTicketController.addQuestion,
	);

	router.delete("/deleteQuestion", editTicketController.deleteQuestion);

	router.delete("/deleteTicket", editTicketController.deleteTicket);

	return router;
};
