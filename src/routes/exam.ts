import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";

import * as examController from "../controllers/examController";

export const getExamRouter = () => {
	const router = express.Router();

	/**
	 * @swagger
	 * /exam:
	 *   get:
	 *     tags:
	 *       - Экзамен
	 *     summary: Получить вопросы по экзамену
	 *     responses:
	 *       200:
	 *         description: Экзамен получен
	 *         content:
	 *           application/json:
	 *             schema:
	 *              type: array
	 *              items:
	 *               $ref: '#/components/schemas/SendExamViewModel'
	 *       error:
	 *         description: Ошибка получения экзамена
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.get("/", checkAuth, examController.sendExam);

	/**
	 * @swagger
	 * /exam/{ticketNumber}:
	 *   post:
	 *     tags:
	 *       - Экзамен
	 *     summary: Отправить ответ на вопрос по экзамену
	 *     parameters:
	 *       - name: ticketNumber
	 *         in: path
	 *         description: Порядковый номер билета
	 *         required: true
	 *         default: 1
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/BodySendExamResult'
	 *     responses:
	 *       '200':
	 *         description: Успешная регистрация
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/SendExamTicketResultViewModel'
	 *       'error':
	 *         description: Ошибка регистрации
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */

	router.post(
		"/:ticketNumber",
		checkAuth,
		answerValidation,
		examController.sendExamResult,
	);

	return router;
};
