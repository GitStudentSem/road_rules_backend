import express from "express";
import * as editorController from "../controllers/editor";
import { addQuestionValidation } from "../validations";
import { handleValudationErrors } from "../midlewares";
import { getErrorWaggerDoc } from "../assets/getErrorSwaggerDoc";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

export const editorSwaggerDoc = {
	"/editor/createTicket": {
		get: {
			tags: ["Редактор билетов"],
			summary: "Создать пустой билет",
			// security: [{ bearerAuth: [] }],
			responses: {
				204: {
					description: "Билет упешно создан",
				},
				error: getErrorWaggerDoc("Ошибка создания билета"),
			},
		},
	},

	"/editor/addQuestion": {
		post: {
			tags: ["Редактор билетов"],
			summary: "Добавить вопрос в билет",
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					formData: {
						schema: { $ref: "#/components/schemas/CreateQuestionBody" },
					},
				},
			},
			responses: {
				204: {
					description: "Вопрос успешно добавлен",
				},
				error: getErrorWaggerDoc("Ошибка добавления вопроса"),
			},
		},
	},

	"/editor/deleteTicket": {
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
				error: getErrorWaggerDoc("Ошибка удаления билета"),
			},
		},
	},

	"/editor/deleteQuestion": {
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
				error: getErrorWaggerDoc("Ошибка удаления вопроса"),
			},
		},
	},
};

export const editorRouter = () => {
	const router = express.Router();

	router.get("/createTicket", editorController.createTicket);

	router.post(
		"/addQuestion",
		upload.single("img"),
		addQuestionValidation,
		handleValudationErrors,
		editorController.addQuestion,
	);

	router.delete("/deleteQuestion", editorController.deleteQuestion);

	router.delete("/deleteTicket", editorController.deleteTicket);

	return router;
};
