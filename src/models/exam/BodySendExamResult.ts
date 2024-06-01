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
 *           required: true
 *         questionNumber:
 *           type: number
 *           description: Порядковый номер вопроса
 *           required: true
 *           default: 1
 */
export type BodySendExamResult = { answerId: string; questionNumber: number };
