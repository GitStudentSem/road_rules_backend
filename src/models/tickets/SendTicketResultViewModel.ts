/**
 * @swagger
 * components:
 *   schemas:
 *     SendTicketResultViewModel:
 *       type: object
 *       properties:
 *         isCorrect:
 *           type: boolean
 *           description: Правильный ответ или нет
 *         correctAnswer:
 *           type: string
 *           description: id правильного ответа
 *         help:
 *           type: string
 *           description: Помощь по вопросу
 */
export type SendTicketResultViewModel = {
	isCorrect: boolean;
	correctAnswer: string;
	help: string;
};
