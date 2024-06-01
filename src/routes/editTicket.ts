import express from "express";
import * as editTicketController from "../controllers/editTicket";
import { addQuestionValidation } from "../validations";
import { handleValudationErrors } from "../midlewares";

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
	router.post(
		"/addQuestion",
		addQuestionValidation,
		handleValudationErrors,
		editTicketController.addQuestion,
	);

	/**
	 * @swagger
	 * /editTicket/deleteQuestion:
	 *   delete:
	 *     tags:
	 *       - Редактор билетов
	 *     summary: Удалить вопрос из билета
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/DeleteTicketBody'
	 *     responses:
	 *       200:
	 *         description: Вопрос успешно удален
	 *         content:
	 *           application/json:
	 *             schema:
	 *              type: object
	 *              properties:
	 *                isDeleted:
	 *                  type: boolean
	 *                  description: Удален ли вопрос из билета
	 *       error:
	 *         description: Ошибка удаления вопроса
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.delete("/deleteQuestion", editTicketController.deleteQuestion);

	/**
	 * @swagger
	 * /editTicket/deleteTicket:
	 *   delete:
	 *     tags:
	 *       - Редактор билетов
	 *     summary: Удалить билет
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *              type: object
	 *              properties:
	 *                ticketId:
	 *                  type: string
	 *                  description: id удаляемого билета
	 *     responses:
	 *       200:
	 *         description: Билет успешно удален
	 *         content:
	 *           application/json:
	 *             schema:
	 *              type: object
	 *              properties:
	 *                isDeleted:
	 *                  type: boolean
	 *                  description: Удален ли билет
	 *       error:
	 *         description: Ошибка удаления билета
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorType'
	 */
	router.delete("/deleteTicket", editTicketController.deleteTicket);

	return router;
};
