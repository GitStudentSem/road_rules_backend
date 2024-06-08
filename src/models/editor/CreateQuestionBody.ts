/**
 * @swagger
 * components:
 *   schemas:
 *     CreateQuestionBody:
 *       type: object
 *       properties:
 *         img:
 *           type: string
 *           format: binary
 *           description: Картинка в виде ArrayBuffer
 *         ticketId:
 *           type: string
 *           default: 1717841402302
 *           description: id билета
 *         question:
 *           type: string
 *           default: Текст вопроса к элементу билета
 *           description: Текст вопроса
 *         help:
 *           type: string
 *           default: Текст помощи по вопросу
 *           description: Текст помощи по вопросу
 *         answers:
 *           type: array
 *           description: Варианты ответов на вопрос
 *           items:
 *            type: string
 *            default: Первый вариант ответа
 *       required:
 *        - ticketId
 *        - question
 *        - help
 *        - answers
 */
export type CreateQuestionBody = {
	img?: ArrayBuffer;
	ticketId: string;
	question: string;
	help: string;
	answers: string[];
};
