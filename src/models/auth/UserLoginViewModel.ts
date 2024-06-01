/**
 * @swagger
 * components:
 *   schemas:
 *     UserLoginViewModel:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: Имя пользователя
 *         secondName:
 *           type: string
 *           description: Фамилия пользователя
 *         token:
 *           type: string
 *           description: Токен зарегестрированного пользователя
 */
export type UserLoginViewModel = {
	token: string;
	firstName: string;
	secondName: string;
};
