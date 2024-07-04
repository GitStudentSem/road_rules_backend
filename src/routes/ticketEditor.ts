import express from "express";
import { ticketEditorController } from "../controllers/ticketEditorController";
import { addQuestionValidation } from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import multer from "multer";
import { CreateQuestionBodySwaggerDoc } from "../models/ticketEditor/CreateQuestionBody";
import { DeleteQuestionlSwaggerDoc } from "../models/ticketEditor/DeleteQuestionBody";
import { EditQuestionBodySwaggerDoc } from "../models/ticketEditor/EditQuestionBody";
import { QuestionViewModelSwaggerDoc } from "../models/ticketEditor/QuestionViewModel";
import { defaultSwaggerValues } from "../assets/settings";
import { SendTicketsViewModelSwaggerDoc } from "../models/tickets/SendTicketsViewModel";
const upload = multer({ storage: multer.memoryStorage() });

export const ticketEditorSwaggerDoc = {
	"/ticketEditor/createTicket": {
		get: {
			tags: ["Редактор билетов"],
			summary: "Создать пустой билет",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Билет успешно создан",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									ticketId: {
										type: "string",
										description: "id созданного билета",
									},
								},
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка создания билета"),
			},
		},
	},
	"/ticketEditor/getQuestions": {
		post: {
			tags: ["Редактор билетов"],
			summary: "Получить вопросы в билете",
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
							},
							required: ["ticketId"],
						},
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
								items: QuestionViewModelSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения вопросов"),
			},
		},
	},

	"/ticketEditor/createQuestion": {
		post: {
			tags: ["Редактор билетов"],
			summary: "Добавить вопрос в билет",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"multipart/form-data": {
						schema: CreateQuestionBodySwaggerDoc,
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

	"/ticketEditor/editQuestion": {
		patch: {
			tags: ["Редактор билетов"],
			summary: "Изменить существующий вопрос",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"multipart/form-data": {
						schema: EditQuestionBodySwaggerDoc,
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

	"/ticketEditor/deleteTicket": {
		delete: {
			tags: ["Редактор билетов"],
			summary: "Удалить билет",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								ticketId: {
									type: "string",
									default: defaultSwaggerValues.ticketId,
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
				error: getErrorSwaggerDoc("Ошибка удаления билета"),
			},
		},
	},

	"/ticketEditor/deleteQuestion": {
		delete: {
			tags: ["Редактор билетов"],
			summary: "Удалить вопрос из билета",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": { schema: DeleteQuestionlSwaggerDoc },
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

	"/ticketEditor/tickets": {
		get: {
			tags: ["Редактор билетов"],
			summary: "Получить список билетов для выбора, включая пустые",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Билеты упешно получены",
					content: {
						"application/json": {
							schema: SendTicketsViewModelSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения билетов"),
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
