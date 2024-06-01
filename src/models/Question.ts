/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         answerText:
 *           type: string
 *           description: Текст варианта ответа
 *         id:
 *           type: string
 *           description: id варианта ответа
 */
export type Question = { answerText: string; id: string };
