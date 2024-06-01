/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegisterViewModel:
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
 *         id:
 *           type: string
 *           description: id созданного пользователя
 */
export type UserRegisterViewModel = {
	email: string;
	firstName: string;
	secondName: string;
	id: string;
};
