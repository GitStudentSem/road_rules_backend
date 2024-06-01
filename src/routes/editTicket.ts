import express from "express";
import * as editTicketController from "../controllers/editTicket";

export const editTicketRouter = () => {
	const router = express.Router();

	/**
	 * @swagger
	 * /editTicket/createTicket:
	 *   get:
	 *     tags:
	 *       - Редактор билетов
	 *     summary: Создать пустой билет
	 *     responses:
	 *       200:
	 *         description: Билет упешно создан
	 *         content:
	 *           application/json:
	 *             schema:
	 *              type: object
	 *              properties:
	 *                isCreated:
	 *                  type: boolean
	 *                  description: Создан ли билет
	 *       error:
	 *         description: Ошибка создания билета
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.get("/createTicket", editTicketController.createTicket);

	/**
	 * @swagger
	 * /editTicket/addQuestion:
	 *   post:
	 *     tags:
	 *       - Редактор билетов
	 *     summary: Добавить вопрос в билет
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateQuestionBody'
	 *     responses:
	 *       200:
	 *         description: Вопрос успешно добавлен
	 *         content:
	 *           application/json:
	 *             schema:
	 *              type: object
	 *              properties:
	 *                isCreated:
	 *                  type: boolean
	 *                  description: Добавлен ли вопрос в билет
	 *       error:
	 *         description: Ошибка добавления вопроса
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.post("/addQuestion", editTicketController.addQuestion);

	return router;
};
