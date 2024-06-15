import express from "express";
import * as editorController from "../controllers/editor";
import { addQuestionValidation } from "../validations";
import { handleValudationErrors } from "../midlewares";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import multer from "multer";
import { CreateQuestionBodySwaggerDoc } from "../models/editor/CreateQuestionBody";
import { DeleteQuestionlSwaggerDoc } from "../models/editor/DeleteQuestionBody";
import { EditQuestionBodySwaggerDoc } from "../models/editor/EditQuestionBody";
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
				error: getErrorSwaggerDoc("Ошибка создания билета"),
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
					"multipart/form-data": {
						schema: CreateQuestionBodySwaggerDoc,
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

	"/editor/editQuestion": {
		patch: {
			tags: ["Редактор билетов"],
			summary: "Изменить существующий вопрос",
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"multipart/form-data": {
						schema: EditQuestionBodySwaggerDoc,
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

	"/editor/deleteQuestion": {
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
	router.post(
		"/addQuestion",
		upload.single("img"),
		addQuestionValidation,
		handleValudationErrors,
		editorController.addQuestion,
	);

	router.delete("/deleteQuestion", editorController.deleteQuestion);
	router.delete("/deleteTicket", editorController.deleteTicket);
	router.patch("/editQuestion", editorController.editQuestion);

	return router;
};
//
