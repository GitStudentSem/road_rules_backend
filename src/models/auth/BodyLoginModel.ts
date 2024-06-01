/**
 * @swagger
 * components:
 *   schemas:
 *     BodyLoginModel:
 *       type: object
 *       required:
 *        - email
 *        - password
 *       properties:
 *         email:
 *           type: string
 *           description: Почта пользователя
 *           default: your_email.yandex.ru
 *         password:
 *           type: string
 *           description: Пароль пользователя
 *           default: 123456
 */
export type BodyLoginModel = {
	email: string;
	password: string;
};
