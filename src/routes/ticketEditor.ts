import express from "express";
import * as editorController from "../controllers/ticketEditor";
import { addQuestionValidation } from "../validations";
import { handleValidationErrors } from "../midlewares";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import multer from "multer";
import { CreateQuestionBodySwaggerDoc } from "../models/ticketEditor/CreateQuestionBody";
import { DeleteQuestionlSwaggerDoc } from "../models/ticketEditor/DeleteQuestionBody";
import { EditQuestionBodySwaggerDoc } from "../models/ticketEditor/EditQuestionBody";
import { QuestionsViewModelSwaggerDoc } from "../models/ticketEditor/QuestionsViewModel";
const upload = multer({ storage: multer.memoryStorage() });

export const editorSwaggerDoc = {
	"/ticketEditor/createTicket": {
		get: {
			tags: ["Редактор билетов"],
			summary: "Создать пустой билет",
			// security: [{ bearerAuth: [] }],
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
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								ticketId: {
									type: "string",
									description: "id билета",
									default: "1717841402302",
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
								items: QuestionsViewModelSwaggerDoc,
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
			// security: [{ bearerAuth: [] }],
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
			// security: [{ bearerAuth: [] }],
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
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								ticketId: {
									type: "string",
									default: "1717841402302",
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
			// security: [{ bearerAuth: [] }],
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
};

export const editorRouter = () => {
	const router = express.Router();

	router.get("/createTicket", editorController.createTicket);
	router.post("/getQuestions", editorController.getQuestionsInTicket);
	router.post(
		"/createQuestion",
		upload.single("img"),
		addQuestionValidation,
		handleValidationErrors,
		editorController.addQuestion,
	);

	router.delete("/deleteQuestion", editorController.deleteQuestion);
	router.delete("/deleteTicket", editorController.deleteTicket);
	router.patch(
		"/editQuestion",
		upload.single("img"),
		addQuestionValidation,
		handleValidationErrors,
		editorController.editQuestion,
	);

	return router;
};