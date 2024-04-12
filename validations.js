import { body } from "express-validator";

export const loginValidation = [
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

export const registerValidation = [
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

export const taskValidation = [
	body("", "Данные должны быть не пустым массивом").isArray({ min: 1 }),
];
