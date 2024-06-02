import express from "express";
import {
	isEmailValid,
	loginValidation,
	registerValidation,
} from "../validations";
import { handleValudationErrors } from "../midlewares";
import * as userController from "../controllers/userController";

export const registerSwaggerDoc = {
	"/auth/register": {
		post: {
			tags: ["Авторизация"],
			summary: "Регистрация нового пользователя",
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/BodyRegisterModel" },
					},
				},
			},
			responses: {
				200: {
					description: "Успешная регистрация",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UserRegisterViewModel",
							},
						},
					},
				},
				error: {
					description: "Ошибка регистрации",
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

	"/auth/login": {
		post: {
			tags: ["Авторизация"],
			summary: "Логин пользователя",
			// security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/BodyLoginModel" },
					},
				},
			},
			responses: {
				200: {
					description: "Успешный логин",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UserLoginViewModel",
							},
						},
					},
				},
				error: {
					description: "Ошибка логина",
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

	"/auth/deleteUser": {
		delete: {
			tags: ["Авторизация"],
			summary: "Удалить пользователя по почте",
			// security: [{ bearerAuth: [] }],
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
							},
						},
					},
				},
			},
			responses: {
				204: {
					description: "Пользователь удален",
				},
				error: {
					description: "Ошибка удаления пользователя",
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
	"/auth/getAllUsers": {
		get: {
			tags: ["Авторизация"],
			summary: "Получить всех пользователей",
			responses: {
				200: {
					description: "Все пользователи получены",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/components/schemas/UserLoginDBModel",
								},
							},
						},
					},
				},
				error: {
					description: "Ошибка получения всех пользователей",
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

export const getAuthRouter = () => {
	const router = express.Router();

	router.post(
		"/register",
		registerValidation,
		handleValudationErrors,
		userController.register,
	);
	router.post(
		"/login",
		loginValidation,
		handleValudationErrors,
		userController.login,
	);

	router.delete(
		"/deleteUser",
		isEmailValid,
		handleValudationErrors,
		userController.deleteUser,
	);

	router.get("/getAllUsers", userController.getAllUsers);

	return router;
};
