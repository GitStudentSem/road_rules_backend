import express from "express";
import {
	isEmailValid,
	loginValidation,
	registerValidation,
} from "../validations";
import { handleValudationErrors } from "../midlewares";
import * as userController from "../controllers/userController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { BodyLoginModelSwaggerDoc } from "../models/auth/BodyLoginModel";
import { BodyRegisterModelSwaggerDoc } from "../models/auth/BodyRegisterModel";
import { UserLoginDBModelSwaggerDoc } from "../models/auth/UserLoginDBModel";
import { UserLoginViewModelSwaggerDoc } from "../models/auth/UserLoginViewModel";
import { UserRegisterViewModelSwaggerDoc } from "../models/auth/UserRegisterViewModel";

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
								items: UserLoginDBModelSwaggerDoc,
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
