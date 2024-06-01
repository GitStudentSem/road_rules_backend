import type { Question } from "../Question";

/**
 * @swagger
 * components:
 *   schemas:
 *     SendTicketViewModel:
 *       type: object
 *       properties:
 *         question:
 *           type: string
 *           description: Вопрос экзамена
 *         img:
 *           type: string
 *           description: Картинка к вопросу в формате base64
 *         answers:
 *           type: array
 *           description: Варианты ответа на вопрос
 *           items:
 *            $ref: '#/components/schemas/Question'
 */
export type SendTicketViewModel = {
	question: string;
	img: string;
	answers: Question[];
};
