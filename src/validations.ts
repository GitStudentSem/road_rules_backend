import { body } from "express-validator";

export const loginValidation = [
	body("email", "Почта должна быть строкой").isString(),
	body("email", "Длина почты должна быть больше 2 символов").isLength({
		min: 6,
	}),
	body("email", "Длина почты должна быть больше 2 символов").isEmail(),

	body("password", "Пароль должен быть строкой").isString(),
	body("password", "Пароль должен быть минимум 5 символов").isLength({
		min: 5,
	}),
];

export const registerValidation = [
	body("email", "Почта должна быть строкой").isString(),
	body("email", "Длина почты должна быть больше 2 символов").isLength({
		min: 6,
	}),
	body("email", "Неверный формат почты").isEmail(),

	body("firstName", "Имя должно быть строкой").isString(),
	body("firstName", "Длина имени должна быть больше 2 символов").isLength({
		min: 2,
	}),

	body("secondName", "Фамилия должна быть строкой").isString(),
	body("secondName", "Длина фамилии должна быть больше 2 символов").isLength({
		min: 2,
	}),

	body("password", "Пароль должен быть строкой").isString(),
	body("password", "Пароль должен быть минимум 5 символов").isLength({
		min: 5,
	}),
];

export const answerValidation = [
	body("userAnswer", "Ответ пользователя должен быть числом").isNumeric(),
	body("questionNumber", "Номер вопроса должен быть числом").isNumeric(),
];
