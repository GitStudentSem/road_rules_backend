/**
 * @swagger
 * components:
 *   schemas:
 *     BodyRegisterModel:
 *       type: object
 *       required:
 *        - email
 *        - firstName
 *        - secondName
 *        - password
 *       properties:
 *         email:
 *           type: string
 *           description: Почта пользователя
 *           default: your_email.yandex.ru
 *         firstName:
 *           type: string
 *           description: Имя пользователя
 *           default: Иван
 *         secondName:
 *           type: string
 *           description: Фамилия пользователя
 *           default: Иванов
 *         password:
 *           type: string
 *           description: Пароль пользователя
 *           default: 123456
 */
export type BodyRegisterModel = {
	email: string;
	firstName: string;
	secondName: string;
	password: string;
};
