/**
 * @swagger
 * components:
 *   schemas:
 *     CreateQuestionBody:
 *       type: object
 *       properties:
 *         img:
 *           type: ArrayBuffer
 *           description: id варианта ответа
 *           required: false
 *         ticketId:
 *           type: string
 *           description: id билета
 *           required: true
 *         question:
 *           type: string
 *           description: Текст вопроса
 *           required: true
 *         help:
 *           type: string
 *           description: Текст помощи по вопросу
 *           required: true
 *         answers:
 *           type: array
 *           description: Варианты ответов на вопрос
 *           required: true
 *           items:
 *            type: string
 */
export type CreateQuestionBody = {
	img?: ArrayBuffer;
	ticketId: string;
	question: string;
	help: string;
	answers: string[];
};
