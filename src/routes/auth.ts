import express from "express";
import {
	isEmailValid,
	loginValidation,
	registerValidation,
} from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import * as userController from "../controllers/userController";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { BodyLoginModelSwaggerDoc } from "../models/auth/BodyLoginModel";
import { BodyRegisterModelSwaggerDoc } from "../models/auth/BodyRegisterModel";

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
	"/auth/adminLogin": {
		post: {
			tags: ["Авторизация"],
			summary: "Логин администратора",
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
			security: [{ bearerAuth: [] }],
			responses: {
				204: {
					description: "Пользователь удален",
				},
				error: getErrorSwaggerDoc("Ошибка удаления пользователя"),
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
	router.post(
		"/adminLogin",
		loginValidation,
		handleValidationErrors,
		userController.adminLogin,
	);
	router.delete("/deleteUser", checkAuth, userController.deleteUser);

	return router;
};
