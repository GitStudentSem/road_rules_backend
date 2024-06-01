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
 *         questionId:
 *           type: string
 *           description: id вопроса который нужно удалить
 *       required:
 *         - ticketId
 *         - questionId
 */
export type DeleteTicketBody = { ticketId: string; questionId: string };
