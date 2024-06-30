import express from "express";
import * as userEditorController from "../controllers/userEditorController";
import { isEmailValid } from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { GetAllUsersViewModelSwaggerDoc } from "../models/auth/GetAllUsersViewModel";

export const userEditorSwaggerDoc = {
	"/userEditor/role": {
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
									default: "your_email@yandex.ru",
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
	"/userEditor/getAllUsers": {
		get: {
			tags: ["Редактор пользователей"],
			summary: "Получить всех пользователей",
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
};

export const userEditorRouter = () => {
	const router = express.Router();
	router.get("/getAllUsers", userEditorController.getAllUsers);
	router.patch(
		"/role",
		checkAuth,
		isEmailValid,
		handleValidationErrors,
		userEditorController.setRole,
	);
	return router;
};
