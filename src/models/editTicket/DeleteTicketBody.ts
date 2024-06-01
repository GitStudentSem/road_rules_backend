/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteTicketBody:
 *       type: object
 *       properties:
 *         ticketId:
 *           type: string
 *           description: id билета из которого нужно удалить вопрос
 *           required: true
 *         questionId:
 *           type: string
 *           description: id вопроса который нужно удалить
 *           required: true
 */
export type DeleteTicketBody = { ticketId: string; questionId: string };
