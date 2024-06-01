import { body } from "express-validator";

const isEmailString = body("email", "Почта должна быть строкой").isString();
const emailLength = body("email", "Длина почты должна быть больше 6 символов")
	.trim()
	.isLength({
		min: 6,
	});
export const isEmailValid = body("email", "Неверный формат почты").isEmail();

const isPasswordString = body(
	"password",
	"Пароль должен быть строкой",
).isString();
const passwordLength = body("password", "Пароль должен быть минимум 6 символов")
	.trim()
	.isLength({
		min: 6,
	});

export const loginValidation = [
	isEmailString,
	emailLength,
	isEmailValid,

	isPasswordString,
	passwordLength,
];

export const registerValidation = [
	isEmailString,
	emailLength,
	isEmailValid,

	isPasswordString,
	passwordLength,
	body("firstName", "имя должно быть строкой").isString(),
	body("firstName", "Длина имени должна быть больше 2 символов")
		.trim()
		.isLength({
			min: 2,
		}),

	body("secondName", "Фамилия должна быть строкой").isString(),
	body("secondName", "Длина фамилии должна быть больше 2 символов")
		.trim()
		.isLength({
			min: 2,
		}),
];

export const answerValidation = [
	body("userAnswer", "Ответ пользователя должен быть числом").isNumeric(),
	body("questionNumber", "Номер вопроса должен быть числом").isNumeric(),
];

export const addQuestionValidation = [
	body("ticketId", "id билета должно быть строкой").isString(),
	body("ticketId", "id не может быть пустым").trim().isLength({ min: 1 }),
	body("question", "Минимальное число сивмолов для попроса: 10").isLength({
		min: 10,
	}),
	body("help", "Минимальное число сивмолов для подсказки: 10").trim().isLength({
		min: 10,
	}),
	body("answers", "Варианты ответов должны быть массивом").isArray(),
	body("answers", "Минимальное количество ответов: 2").isArray({ min: 2 }),
	body("answers.*", "Вариант ответа должны быть строкой").isString(),
];
