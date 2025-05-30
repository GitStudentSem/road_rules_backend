import { body } from "express-validator";

const isEmailString = body("email", "Почта должна быть строкой").isString();
const emailLength = body("email", "Длина почты должна быть больше 6 символов")
	.trim()
	.isLength({
		min: 6,
	});
export const isEmailValid = body("email", "Неверный формат почты").isEmail();

export const checkIsPassExam = body(
	"isPassExam",
	"Неверный формат фильтра",
).isBoolean();

const isPasswordString = body(
	"password",
	"Пароль должен быть строкой",
).isString();
const passwordLength = body("password", "Пароль должен быть минимум 6 символов")
	.trim()
	.isLength({
		min: 6,
	});

const checkNullable = (fieldName: string) => {
	return body(fieldName).custom((value) => {
		if (value === null || value === false || value === "") {
			throw new Error(`Неправильное значение поля: ${fieldName}`);
		}
		return true;
	});
};

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
	body("firstName", "Имя должно быть строкой").isString(),
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
	body("autoSchoolName", "Имя автошколы не должено быть пустым")
		.trim()
		.isLength({
			min: 1,
		}),
];

export const answerValidation = [
	checkNullable("ticketId"),
	body("ticketId", "id билета должен быть строкой").isString(),

	body("questionId", "id вопроса должен быть строкой").isString(),

	body("answerId", "id ответа пользователя должен быть строкой").isString(),
];

export const addQuestionValidation = [
	body("ticketId", "id билета должно быть строкой").isString(),
	body("ticketId", "id не может быть пустым").trim().isLength({ min: 1 }),

	body("help", "Помощь по вопросу должна быть строкой").isString(),
	body("help", "Минимальное число сивмолов для подсказки: 1").trim().isLength({
		min: 1,
	}),

	body("correctAnswer", "Не выбран правильный ответ").exists(),
	body("correctAnswer", "Правильный ответ должен быть числом").isNumeric(),

	body("answers", "Варианты ответов должны быть массивом").isArray(),
	body("answers", "Минимальное количество ответов: 2").isArray({ min: 2 }),
	body("answers.*", "Вариант ответа не должен быть пустым").isLength({
		min: 1,
	}),
	body("answers.*", "Вариант ответа должны быть строкой").isString(),
];

export const appointExamValidation = [
	body(
		"isAppoint",
		"Назначен экзамен или нет должно быть в булевом формате",
	).isBoolean(),
	isEmailValid,
];
