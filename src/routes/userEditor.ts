import express from "express";
import * as userEditorController from "../controllers/userEditorController";
import { appointExamValidation, isEmailValid } from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { GetAllUsersViewModelSwaggerDoc } from "../models/auth/GetAllUsersViewModel";
import { BodyAppointExamSwaggerDoc } from "../models/exam/BodyAppointExam";
import { defaultSwaggerValues } from "../assets/settings";

export const userEditorSwaggerDoc = {
	"/api/userEditor/role": {
		patch: {
			tags: ["Редактор пользователей"],
			summary: "Установить роль для пользователя",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
									default: defaultSwaggerValues.email,
									description: "Почта пользователя",
								},
								role: {
									type: "admin | user",
									default: "user",
									description: "Роль пользователя",
								},
							},
						},
					},
				},
			},
			responses: {
				204: {
					description: "Пользователь удален",
				},
				error: getErrorSwaggerDoc("Ошибка удаления пользователя"),
			},
		},
	},
	"/api/userEditor/getAllUsers": {
		get: {
			tags: ["Редактор пользователей"],
			summary: "Получить всех пользователей",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Все пользователи получены",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: GetAllUsersViewModelSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения всех пользователей"),
			},
		},
	},
	"/api/userEditor/appoint": {
		post: {
			tags: ["Редактор пользователей"],
			summary: "Назначить экзамен для пользователя",
			security: [{ bearerAuth: [] }],

			requestBody: {
				content: {
					"application/json": {
						schema: BodyAppointExamSwaggerDoc,
					},
				},
			},
			responses: {
				204: {
					description: "Экзамен назначен",
				},
				error: getErrorSwaggerDoc("Ошибка назначения экзамена"),
			},
		},
	},

	"/api/userEditor/deleteUser": {
		delete: {
			tags: ["Редактор пользователей"],
			summary: "Удалить пользователя по почте",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
									default: defaultSwaggerValues.email,
									description: "Поста пользователя",
								},
							},
						},
					},
				},
			},
			responses: {
				204: {
					description: "Пользователь удален",
				},
				error: getErrorSwaggerDoc("Ошибка удаления пользователя"),
			},
		},
	},
};

export const userEditorRouter = () => {
	const router = express.Router();
	router.get("/getAllUsers", checkAuth, userEditorController.getAllUsers);
	router.patch(
		"/role",
		checkAuth,
		isEmailValid,
		handleValidationErrors,
		userEditorController.setRole,
	);
	router.post(
		"/appoint",
		checkAuth,
		appointExamValidation,
		handleValidationErrors,
		userEditorController.appointExam,
	);
	router.delete("/deleteUser", checkAuth, userEditorController.deleteUser);
	return router;
};
