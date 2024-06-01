/**
 * @swagger
 * components:
 *   schemas:
 *     Result:
 *       type: object
 *       properties:
 *         isCorrect:
 *           type: boolean
 *           description: Правильный ответ или нет
 *         answerId:
 *           type: string
 *           description: id ответа который дал пользователь
 */
type Result = {
	isCorrect?: boolean;
	answerId?: string;
};
/**
 * @swagger
 * components:
 *   schemas:
 *     UserLoginDBModel:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Почта пользователя
 *         firstName:
 *           type: string
 *           description: Имя пользователя
 *         secondName:
 *           type: string
 *           description: Фамилия пользователя
 *         passwordHash:
 *           type: string
 *           description: Зашифрованный пароль пользователя
 *         id:
 *           type: string
 *           description: id пользователя
 *         results:
 *           type: object
 *           description: Результаты билетов и экзамена пользователя
 *           properties:
 *            exam:
 *              type: array
 *              description: Массив результатов экзамена
 *              items:
 *                $ref: '#/components/schemas/Result'
 *            ticket-1:
 *              type: array
 *              description: Массив результатов билетов
 *              items:
 *                $ref: '#/components/schemas/Result'
 */
export type UserLoginDBModel = {
	email: string;
	firstName: string;
	secondName: string;
	passwordHash: string;
	id: string;
	results: {
		/** key format: ticket-n где n - это число */
		[key: string]: Result[] | undefined;
		exam?: Result[];
	};
};
