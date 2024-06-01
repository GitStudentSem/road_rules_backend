import express from "express";
import {
	isEmailValid,
	loginValidation,
	registerValidation,
} from "../validations";
import { handleValudationErrors } from "../midlewares";
import * as userController from "../controllers/userController";

export const getAuthRouter = () => {
	const router = express.Router();

	/**
	 * @swagger
	 * /auth/register:
	 *   post:
	 *     tags:
	 *       - Авторизация
	 *     summary: Регистрация нового пользователя
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/BodyRegisterModel'
	 *     responses:
	 *       200:
	 *         description: Успешная регистрация
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserRegisterViewModel'
	 *       error:
	 *         description: Ошибка регистрации
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.post(
		"/register",
		registerValidation,
		handleValudationErrors,
		userController.register,
	);

	/**
	 * @swagger
	 * /auth/login:
	 *   post:
	 *     tags:
	 *      - Авторизация
	 *     summary: Логин пользователя
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/BodyLoginModel'
	 *     responses:
	 *       200:
	 *         description: Успешный логин
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserLoginViewModel'
	 *       error:
	 *         description: Ошибка логина
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.post(
		"/login",
		loginValidation,
		handleValudationErrors,
		userController.login,
	);

	/**
	 * @swagger
	 * /auth/delete:
	 *   post:
	 *     tags:
	 *      - Авторизация
	 *     summary: Удалить пользователя по почте
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *              type: object
	 *              properties:
	 *                email:
	 *                  type: string
	 *                  default: your_email@yandex.ru
	 *                  description: Почта пользователя
	 *     responses:
	 *       200:
	 *         description: Пользователь удален
	 *         content:
	 *           application/json:
	 *             schema:
	 *              type: object
	 *              properties:
	 *                isDeleted:
	 *                  type: boolean
	 *                  description: Удален пользователь или нет
	 *       error:
	 *         description: Ошибка удаления пользователя
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.post(
		"/delete",
		isEmailValid,
		handleValudationErrors,
		userController.deleteUser,
	);

	/**
	 * @swagger
	 * /auth/getAllUsers:
	 *   get:
	 *     tags:
	 *      - Авторизация
	 *     summary: Получить всех пользователей
	 *     responses:
	 *       200:
	 *         description: Все пользователи получены
	 *         content:
	 *           application/json:
	 *             schema:
	 *              type: array
	 *              items:
	 *               $ref: '#/components/schemas/UserLoginDBModel'
	 *       error:
	 *         description: Ошибка получения всех пользователей
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.get("/getAllUsers", userController.getAllUsers);

	return router;
};
