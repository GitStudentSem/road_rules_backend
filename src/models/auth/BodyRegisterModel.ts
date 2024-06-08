export const BodyRegisterModelSwaggerDoc = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя",
			default: "your_email@yandex.ru",
			required: true,
		},
		password: {
			type: "string",
			description: "Пароль пользователя",
			default: "123456",
		},
		firstName: {
			type: "string",
			description: "Имя пользователя",
			default: "Иван",
		},
		secondName: {
			type: "string",
			description: "Фамилия пользователя",
			default: "Иванов",
		},
	},
	required: ["email", "password", "firstName", "secondName"],
};

export type BodyRegisterModel = {
	email: string;
	firstName: string;
	secondName: string;
	password: string;
};
