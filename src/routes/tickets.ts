import express from "express";
import { answerValidation } from "../validations";
import { checkAuth } from "../midlewares";
import * as taskController from "../controllers/ticketsController";

export const getTicketsRouter = () => {
	const router = express.Router();

	/**
	 * @swagger
	 * /tickets/count:
	 *   get:
	 *     tags:
	 *       - Билеты
	 *     summary: Получить количество билетов
	 *     responses:
	 *       200:
	 *         description: Количество билетов упешно получено
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/SendTicketsCountViewModel'
	 *       error:
	 *         description: Ошибка получения количества билетов
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.get("/count", checkAuth, taskController.sendTicketsCount);

	/**
	 * @swagger
	 * /tickets/{ticketNumber}:
	 *   get:
	 *     tags:
	 *       - Билеты
	 *     summary: Получить указанный билет
	 *     parameters:
	 *       - name: ticketNumber
	 *         in: path
	 *         description: Порядковый номер билета
	 *         required: true
	 *         default: 1
	 *     responses:
	 *       200:
	 *         description: Билет успешно получен
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                $ref: '#/components/schemas/SendTicketViewModel'
	 *       error:
	 *         description: Ошибка получения билета
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.get("/:ticketNumber", checkAuth, taskController.sendTicket);

	/**
	 * @swagger
	 * /tickets/{ticketNumber}:
	 *   post:
	 *     tags:
	 *       - Билеты
	 *     summary: Отправить ответ на вопрос по билету
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
	 *             $ref: '#/components/schemas/BodySendTicketResult'
	 *     responses:
	 *       200:
	 *         description: Ответ упешно отправлен
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/SendTicketResultViewModel'
	 *       error:
	 *         description: Ошибка отправки ответа
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.post(
		"/:ticketNumber",
		checkAuth,
		answerValidation,
		taskController.sendTicketResult,
	);

	return router;
};
