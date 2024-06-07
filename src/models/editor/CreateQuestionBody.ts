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
 *           description: id билета
 *         question:
 *           type: string
 *           description: Текст вопроса
 *         help:
 *           type: string
 *           description: Текст помощи по вопросу
 *         answers:
 *           type: array
 *           description: Варианты ответов на вопрос
 *           items:
 *            type: string
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
