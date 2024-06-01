/**
 * @swagger
 * components:
 *   schemas:
 *     BodySendExamResult:
 *       type: object
 *       properties:
 *         answerId:
 *           type: string
 *           description: id варианта ответа
 *         questionNumber:
 *           type: number
 *           description: Порядковый номер вопроса
 *           default: 1
 *       required:
 *         - answerId
 *         - questionNumber
 */
export type BodySendExamResult = { answerId: string; questionNumber: number };
