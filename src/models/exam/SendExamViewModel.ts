import type { Question } from "../Question";

/**
 * @swagger
 * components:
 *   schemas:
 *     SendExamViewModel:
 *       type: object
 *       properties:
 *         question:
 *           type: string
 *           description: Вопрос экзамена
 *         img:
 *           type: string
 *           description: Картинка к вопросу в формате base64
 *         ticketNumber:
 *           type: number
 *           description: Порядковый номер билета
 *         answers:
 *           type: array
 *           description: Варианты ответа на вопрос
 *           items:
 *            $ref: '#/components/schemas/Question'
 */
export type SendExamViewModel = {
	question: string;
	img: string;
	ticketNumber: number;
	answers: Question[];
};
