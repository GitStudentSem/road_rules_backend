/**
 * @swagger
 * components:
 *   schemas:
 *     SendExamTicketResultViewModel:
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
export type SendExamTicketResultViewModel = {
	isCorrect: boolean;
	correctAnswer: string;
	help: string;
};
