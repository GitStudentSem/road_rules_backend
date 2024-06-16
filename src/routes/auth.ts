import express from "express";
import {
	isEmailValid,
	loginValidation,
	registerValidation,
} from "../validations";
import { handleValidationErrors } from "../midlewares";
import * as userController from "../controllers/userController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { BodyLoginModelSwaggerDoc } from "../models/auth/BodyLoginModel";
import { BodyRegisterModelSwaggerDoc } from "../models/auth/BodyRegisterModel";

import { UserLoginViewModelSwaggerDoc } from "../models/auth/UserLoginViewModel";
import { UserRegisterViewModelSwaggerDoc } from "../models/auth/UserRegisterViewModel";
import { GetAllUsersViewModelSwaggerDoc } from "../models/auth/GetAllUsersViewModel";

export const registerSwaggerDoc = {
	"/auth/register": {
		post: {
			tags: ["Авторизация"],
			summary: "Регистрация нового пользователя",
			requestBody: {
				content: {
					"application/json": {
						schema: BodyRegisterModelSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Успешная регистрация",
					content: {
						"application/json": {
							schema: UserRegisterViewModelSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка регистрации"),
			},
		},
	},

	"/auth/login": {
		post: {
			tags: ["Авторизация"],
			summary: "Логин пользователя",
			requestBody: {
				content: {
					"application/json": {
						schema: BodyLoginModelSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Успешный логин",
					content: {
						"application/json": {
							schema: UserLoginViewModelSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка логина"),
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
				error: getErrorSwaggerDoc("Ошибка удаления пользователя"),
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

export const getAuthRouter = () => {
	const router = express.Router();

	router.post(
		"/register",
		registerValidation,
		handleValidationErrors,
		userController.register,
	);
	router.post(
		"/login",
		loginValidation,
		handleValidationErrors,
		userController.login,
	);

	router.delete(
		"/deleteUser",
		isEmailValid,
		handleValidationErrors,
		userController.deleteUser,
	);

	router.get("/getAllUsers", userController.getAllUsers);

	return router;
};
